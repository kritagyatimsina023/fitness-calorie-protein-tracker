# 17. Global Error Handling Architecture

Design and implement a **centralized, class-based global error-handling architecture**.

The error-handling system must be reusable across:

- Server Actions
- Services
- Authentication
- Database operations
- External API integrations
- Validation
- Route handlers
- UI error handling

The goal is to prevent every feature from implementing its own error-handling pattern.

The architecture should follow:

```text
UI
 ↓
Server Action
 ↓
try/catch
 ↓
normalizeError()
 ↓
handleError()
 ↓
Safe error response
 ↓
UI
```

However, understand that `normalizeError()` and `handleError()` have different responsibilities.

---

## 17.1 Error Hierarchy

Use a centralized `AppError` class as the base application error.

The application should support these error codes:

```ts
export type Errorcode =
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "BAD_REQUEST"
  | "INTERNAL";
```

Use these resources:

```ts
export const ErrorResource = {
  AUTH: "AUTH",
  USER: "USER",
  FOOD: "FOOD",
  MEAL: "MEAL",
  NUTRITION: "NUTRITION",
  GOAL: "GOAL",
  PROFILE: "PROFILE",
  DASHBOARD: "DASHBOARD",
  VERIFICATION: "VERIFICATION",
  EXTERNAL_API: "EXTERNAL_API",
} as const;

export type ErrorResource = (typeof ErrorResource)[keyof typeof ErrorResource];
```

The resource list may be adjusted as the application architecture is finalized.

---

# 17.2 AppError

Use a class-based `AppError`.

The base structure should follow this pattern:

```ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: Errorcode,
    public readonly statusCode: number,
    public readonly resource: ErrorResource,
  ) {
    super(message);

    this.name = "AppError";

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

### Why this class exists

`AppError` represents an error that is intentionally created by our application.

For example:

```ts
throw new AppError("Food entry not found", "NOT_FOUND", 404, "FOOD");
```

This is different from an unexpected JavaScript error such as:

```ts
throw new Error("Database connection crashed");
```

The application knows how to safely handle `AppError`.

For an unexpected error, the system must normalize it into an `INTERNAL` error before returning anything to the client.

---

# 17.3 Errors Factory

Create a centralized `Errors` factory.

Use the following pattern:

```ts
import { AppError } from "./app-error";

export const Errors = {
  validation(message: string, resource: AppError["resource"]) {
    return new AppError(message, "VALIDATION", 422, resource);
  },

  unauthorized(message: string, resource: AppError["resource"]) {
    return new AppError(message, "UNAUTHORIZED", 401, resource);
  },

  forbidden(message: string, resource: AppError["resource"]) {
    return new AppError(message, "FORBIDDEN", 403, resource);
  },

  notFound(message: string, resource: AppError["resource"]) {
    return new AppError(message, "NOT_FOUND", 404, resource);
  },

  conflict(message: string, resource: AppError["resource"]) {
    return new AppError(message, "CONFLICT", 409, resource);
  },

  badRequest(message: string, resource: AppError["resource"]) {
    return new AppError(message, "BAD_REQUEST", 400, resource);
  },

  internal(message: string, resource: AppError["resource"]) {
    return new AppError(message, "INTERNAL", 500, resource);
  },
};
```

The factory exists to make application errors consistent.

Instead of repeatedly writing:

```ts
new AppError("Food not found", "NOT_FOUND", 404, "FOOD");
```

services/actions can write:

```ts
throw Errors.notFound("Food not found", "FOOD");
```

This improves consistency and readability.

---

# 17.4 Where Errors Should Be Created

Errors should be created at the layer that understands the problem.

## Service Layer

Services should create domain/database-related application errors.

Example:

```ts
class FoodService {
  async getFoodById(foodId: string) {
    const food = await prisma.food.findUnique({
      where: {
        id: foodId,
      },
    });

    if (!food) {
      throw Errors.notFound("Food not found", "FOOD");
    }

    return food;
  }
}
```

The service knows that the requested food does not exist, therefore the service creates the `NOT_FOUND` error.

---

## Authentication Service

Authentication-related errors should be created by the authentication layer.

Example:

```ts
if (!user) {
  throw Errors.unauthorized("Invalid email or password", "AUTH");
}
```

Do not expose whether an email exists in the database when doing authentication where that could enable account enumeration.

---

## Authorization

If the user is authenticated but does not have permission:

```ts
throw Errors.forbidden(
  "You do not have permission to perform this action",
  "FOOD",
);
```

Use:

- `UNAUTHORIZED` → user is not authenticated
- `FORBIDDEN` → user is authenticated but lacks permission

---

## Server Action

Server Actions should create errors when the problem specifically belongs to the action boundary.

For example, malformed `FormData` or missing required action input can be handled by validation.

However, do not duplicate business logic that belongs in the Service.

---

# 17.5 Zod Validation Errors

Use Zod for input validation.

Example:

```ts
const result = FoodEntrySchema.safeParse(data);

if (!result.success) {
  throw Errors.validation(
    result.error.issues[0]?.message ?? "Invalid input",
    "FOOD",
  );
}
```

Alternatively, when using `parse()`:

```ts
try {
  const data = FoodEntrySchema.parse(input);
} catch (error) {
  // normalizeError() handles ZodError
}
```

The centralized normalization system must understand `ZodError`.

---

# 17.6 normalizeError()

Create a centralized `normalizeError()` function.

Its responsibility is:

> Convert every possible unknown error into a safe, predictable `AppError`.

Use the following structure as the reference implementation:

```ts
import { Prisma } from "@/generated/prisma/client";
import { ZodError } from "zod";
import { AppError } from "./app-error";

export function normalizeError(
  error: unknown,
  resource: AppError["resource"],
): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof ZodError) {
    return new AppError(
      error.issues[0]?.message ?? "Invalid input",
      "VALIDATION",
      400,
      resource,
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return new AppError(
          "A record with this information already exists.",
          "CONFLICT",
          409,
          resource,
        );

      case "P2025":
        return new AppError(
          "The requested record was not found.",
          "NOT_FOUND",
          404,
          resource,
        );

      default:
        break;
    }
  }

  console.error(`Unexpected ${resource} error:`, error);

  return new AppError(
    "Something went wrong. Please try again.",
    "INTERNAL",
    500,
    resource,
  );
}
```

Codex should improve this implementation where appropriate, but preserve the architecture.

---

# 17.7 IMPORTANT — Never Leak Raw Errors

Never return this directly to the client:

```ts
catch (error) {
  return {
    success: false,
    error: error,
  };
}
```

Never expose:

```text
Prisma error messages
Database connection details
SQL queries
Stack traces
JWT secrets
JWT contents
API keys
External API credentials
Filesystem paths
Internal implementation details
```

For example, never return:

```text
Invalid `prisma.food.findUnique()` invocation...
DATABASE_URL=...
```

Instead return:

```ts
{
  success: false,
  error: {
    code: "INTERNAL",
    message: "Something went wrong. Please try again.",
    resource: "FOOD",
  },
}
```

---

# 17.8 handleError()

Create a centralized `handleError()` function.

Its responsibility is to convert an error into the **safe structure that can be returned to the UI**.

Use this pattern:

```ts
import { AppError } from "./app-error";

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      resource: error.resource,
    };
  }

  console.error("Unexpected error", error);

  return {
    code: "INTERNAL" as const,
    message: "Something went wrong. Please try again.",
    resource: undefined,
  };
}
```

Do not return the HTTP status code unless the action/API architecture specifically requires it.

The UI primarily needs a predictable safe error structure.

---

# 17.9 Difference Between normalizeError() and handleError()

This distinction is important.

## normalizeError()

Purpose:

```text
unknown error
      ↓
known AppError
```

It converts:

```text
ZodError
PrismaError
AppError
unknown Error
```

into:

```text
AppError
```

Example:

```ts
const appError = normalizeError(error, "FOOD");
```

---

## handleError()

Purpose:

```text
AppError
      ↓
safe client response
```

Example:

```ts
return {
  success: false,
  error: handleError(appError),
};
```

Therefore:

```text
normalizeError()
    ↓
AppError
    ↓
handleError()
    ↓
safe response
```

Do not merge these responsibilities unnecessarily.

---

# 17.10 Standard Server Action try/catch Pattern

Every mutation Server Action should follow a consistent pattern.

Example:

```ts
"use server";

export async function createFoodEntryAction(input: CreateFoodEntryInput) {
  try {
    // 1. Authenticate
    const user = await requireUser();

    // 2. Validate
    const validatedInput = CreateFoodEntrySchema.parse(input);

    // 3. Call service
    const foodEntry = await foodService.createFoodEntry({
      userId: user.id,
      ...validatedInput,
    });

    // 4. Cache invalidation
    revalidatePath("/dashboard");

    return {
      success: true,
      data: foodEntry,
    };
  } catch (error) {
    const appError = normalizeError(error, "FOOD");

    return {
      success: false,
      error: handleError(appError),
    };
  }
}
```

The expected flow is:

```text
Client
 ↓
Server Action
 ↓
Authentication
 ↓
Validation
 ↓
Service
 ↓
Prisma
 ↓
Database
```

If anything throws:

```text
Error
 ↓
catch
 ↓
normalizeError()
 ↓
AppError
 ↓
handleError()
 ↓
safe response
 ↓
UI
```

---

# 17.11 Server Action Responsibilities

The Server Action should:

1. Receive input
2. Authenticate the request
3. Validate input
4. Perform authorization checks when appropriate
5. Call the Service
6. Perform cache invalidation after successful mutation
7. Catch errors
8. Normalize errors
9. Convert errors into safe UI responses

Example:

```ts
try {
  const user = await requireUser();

  const validatedInput = CreateFoodEntrySchema.parse(input);

  await foodService.createFoodEntry({
    userId: user.id,
    ...validatedInput,
  });

  revalidatePath("/dashboard");

  return {
    success: true,
  };
} catch (error) {
  const appError = normalizeError(error, "FOOD");

  return {
    success: false,
    error: handleError(appError),
  };
}
```

---

# 17.12 Service Responsibilities

Services should:

- Perform database operations
- Perform business logic
- Throw meaningful `AppError`s
- Use `Errors.*()` factory methods
- Use Prisma transactions when required

Example:

```ts
class FoodService {
  async deleteFoodEntry(userId: string, foodEntryId: string) {
    const entry = await prisma.foodEntry.findUnique({
      where: {
        id: foodEntryId,
      },
    });

    if (!entry) {
      throw Errors.notFound("Food entry not found", "FOOD");
    }

    if (entry.userId !== userId) {
      throw Errors.forbidden(
        "You do not have permission to delete this entry",
        "FOOD",
      );
    }

    return prisma.foodEntry.delete({
      where: {
        id: foodEntryId,
      },
    });
  }
}
```

Notice that the service does NOT:

```text
revalidatePath()
revalidateTag()
return toast messages
modify UI state
```

Those concerns belong outside the service.

---

# 17.13 Database Error Mapping

Prisma errors must never be returned directly.

Create centralized mappings for relevant Prisma error codes.

At minimum consider:

```text
P2002 → CONFLICT
P2025 → NOT_FOUND
```

Other Prisma errors should generally become:

```text
INTERNAL
```

unless there is a safe, intentional mapping.

Example:

```ts
if (error instanceof Prisma.PrismaClientKnownRequestError) {
  switch (error.code) {
    case "P2002":
      return new AppError(
        "A record with this information already exists.",
        "CONFLICT",
        409,
        resource,
      );

    case "P2025":
      return new AppError(
        "The requested record was not found.",
        "NOT_FOUND",
        404,
        resource,
      );
  }
}
```

Do not expose the raw Prisma message.

---

# 17.14 External API Errors

External nutrition APIs must also use the same error architecture.

Example:

```ts
try {
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw Errors.internal(
      "Nutrition provider is temporarily unavailable.",
      "EXTERNAL_API",
    );
  }

  return await response.json();
} catch (error) {
  throw normalizeError(error, "EXTERNAL_API");
}
```

However, do not expose:

```text
API key
provider URL containing secrets
provider stack traces
raw provider response
internal request information
```

The UI should receive something like:

```ts
{
  code: "INTERNAL",
  message: "Nutrition data is temporarily unavailable. Please try again.",
  resource: "EXTERNAL_API"
}
```

---

# 17.15 Authentication Error Handling

Authentication errors require extra care.

For example, login should generally return:

```ts
Errors.unauthorized("Invalid email or password", "AUTH");
```

instead of:

```text
Email does not exist
```

or:

```text
Password is incorrect
```

This helps prevent user/account enumeration.

For email verification:

```ts
Errors.badRequest(
  "Verification link is invalid or has expired.",
  "VERIFICATION",
);
```

Do not expose:

```text
JWT verification internals
JWT signing configuration
secret keys
database token records
```

---

# 17.16 Logging Strategy

Errors should be logged at the appropriate boundary.

### Expected application errors

For errors such as:

```text
NOT_FOUND
VALIDATION
FORBIDDEN
CONFLICT
```

do not necessarily log them as unexpected server errors.

These are expected application conditions.

### Unexpected errors

Unexpected errors should be logged.

Example:

```ts
console.error(`[${resource}] Unexpected error`, error);
```

In production, this should eventually be replaced or supplemented with a structured logging/monitoring solution.

Never log:

```text
passwords
JWTs
verification tokens
session tokens
API keys
database credentials
sensitive personal information
```

---

# 17.17 UI Error Response Contract

Every Server Action should return a predictable structure.

Success:

```ts
{
  success: true,
  data: ...
}
```

Failure:

```ts
{
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "Food entry not found",
    resource: "FOOD"
  }
}
```

The exact generic TypeScript type should be designed centrally.

For example:

```ts
type ActionSuccess<T> = {
  success: true;
  data: T;
};

type ActionFailure = {
  success: false;
  error: {
    code: Errorcode;
    message: string;
    resource?: ErrorResource;
  };
};

type ActionResult<T> = ActionSuccess<T> | ActionFailure;
```

Adapt this structure where necessary.

---

# 17.18 Error Handling Flow

The complete architecture should be:

```text
                    ┌─────────────────┐
                    │       UI        │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Server Action   │
                    └────────┬────────┘
                             │
                  ┌──────────┴──────────┐
                  │                     │
             Validation             Auth/Authz
                  │                     │
                  └──────────┬──────────┘
                             ▼
                    ┌─────────────────┐
                    │    Service      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Prisma      │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    └─────────────────┘
```

On error:

```text
Service / Validation / Prisma / External API
                  │
                  ▼
              try/catch
                  │
                  ▼
          normalizeError()
                  │
                  ▼
              AppError
                  │
                  ▼
            handleError()
                  │
                  ▼
         Safe ActionResult
                  │
                  ▼
                 UI
```

---

# 17.19 Rules Codex Must Follow

These are mandatory:

### Rule 1

Use a class-based `AppError`.

### Rule 2

Use the centralized `Errors` factory to create common application errors.

### Rule 3

Use `normalizeError()` to convert unknown errors into `AppError`.

### Rule 4

Use `handleError()` to convert errors into safe UI responses.

### Rule 5

Every mutation Server Action must have a consistent `try/catch`.

### Rule 6

Server Actions should call:

```text
normalizeError()
→ handleError()
```

inside their error path.

### Rule 7

Services may throw `AppError`s.

### Rule 8

Services must not perform Next.js cache invalidation.

### Rule 9

Prisma errors must never be returned directly to the client.

### Rule 10

Zod errors must be converted into `VALIDATION`.

### Rule 11

Prisma `P2002` should map to `CONFLICT`.

### Rule 12

Prisma `P2025` should map to `NOT_FOUND`.

### Rule 13

Unexpected errors should map to `INTERNAL`.

### Rule 14

Never expose stack traces or infrastructure details to users.

### Rule 15

Never expose passwords, JWT secrets, verification tokens, session tokens, API keys, or database credentials.

### Rule 16

`UNAUTHORIZED` means authentication is missing/invalid.

### Rule 17

`FORBIDDEN` means the user is authenticated but lacks permission.

### Rule 18

Error resources must identify the domain that generated the error.

Example:

```text
FOOD
AUTH
USER
NUTRITION
GOAL
```

### Rule 19

Do not put UI-specific messages or toast handling inside Services.

### Rule 20

Do not duplicate error normalization logic across individual actions.

There should be **one centralized error normalization strategy**.

---

# 17.20 Recommended File Structure

Include the error-handling architecture in the project structure.

For example:

```text
src/
├── lib/
│   └── errors/
│       ├── app-error.ts
│       ├── error-codes.ts
│       ├── error-resources.ts
│       ├── errors.ts
│       ├── normalize-error.ts
│       ├── handle-error.ts
│       └── index.ts
│
├── actions/
│   ├── auth/
│   ├── food/
│   ├── meal/
│   ├── nutrition/
│   └── goal/
│
├── services/
│   ├── auth/
│   ├── food/
│   ├── meal/
│   ├── nutrition/
│   └── goal/
```

You may adjust the exact structure if another organization better fits the final architecture, but the error-handling utilities must remain centralized and reusable.

---

# 17.21 Example: Complete Mutation

Use this as the conceptual example Codex should follow:

```ts
"use server";

export async function deleteFoodEntryAction(foodEntryId: string) {
  try {
    const user = await requireUser();

    const validatedId = FoodEntryIdSchema.parse(foodEntryId);

    await foodService.deleteFoodEntry(user.id, validatedId);

    revalidatePath("/dashboard");
    revalidatePath("/history");

    return {
      success: true,
    };
  } catch (error) {
    const appError = normalizeError(error, "FOOD");

    return {
      success: false,
      error: handleError(appError),
    };
  }
}
```

The important architecture is:

```text
deleteFoodEntryAction()
        │
        ├── authenticate
        │
        ├── validate
        │
        ├── FoodService.deleteFoodEntry()
        │             │
        │             └── Prisma
        │
        ├── cache invalidation
        │
        └── catch
              │
              ├── normalizeError()
              │
              └── handleError()
```

If the service detects that the record does not exist:

```ts
throw Errors.notFound("Food entry not found", "FOOD");
```

the result becomes:

```ts
{
  success: false,
  error: {
    code: "NOT_FOUND",
    message: "Food entry not found",
    resource: "FOOD",
  },
}
```

If Prisma unexpectedly fails:

```text
Prisma Error
     ↓
normalizeError()
     ↓
AppError(
  "Something went wrong. Please try again.",
  "INTERNAL",
  500,
  "FOOD"
)
     ↓
handleError()
     ↓
Safe response
```

The client should **never know what the actual Prisma/database failure was**.

---

# 17.22 Final Error Handling Objective

The final implementation must provide:

```text
ONE
centralized
class-based
type-safe
reusable
secure
error-handling architecture
```

with this core pattern:

```text
Errors.*
    ↓
AppError
    ↓
throw from Service / Action
    ↓
try/catch in Action
    ↓
normalizeError()
    ↓
handleError()
    ↓
ActionResult
    ↓
UI
```

The implementation should prioritize:

- Type safety
- Security
- Consistency
- Separation of concerns
- Maintainability
- Reusability
- Safe client responses
- Clear debugging/logging

Do not create separate ad-hoc error handling systems for each feature.
