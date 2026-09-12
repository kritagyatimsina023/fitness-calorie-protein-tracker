# Calorie & Protein Intake Tracker — Setup & Architecture Planning

I want to build a production-quality web application for tracking daily calorie and protein intake.

At this stage, **DO NOT implement the application yet**.

Your task is to analyze the requirements below and produce a **complete implementation/setup plan and technical architecture** that we can follow step by step later.

The goal is to build this as a serious full-stack project, with clean architecture, proper authentication, database design, scalable folder structure, validation, caching, and maintainable code.

---

## 1. Core Technology Stack

The application must use:

- Next.js
- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL as the database
- Server Actions where appropriate
- JWT-based authentication
- REST/external APIs where required
- Responsive UI for:
  - Mobile
  - Tablet
  - Laptop
  - Desktop
  - Large screens

Use modern Next.js conventions and avoid unnecessary client-side code.

Prefer Server Components by default and use Client Components only where interactivity requires them.

---

# 2. Main Application Concept

The application is a **Calorie and Protein Intake Tracker**.

A user should be able to:

1. Create an account
2. Verify their email
3. Log in
4. Set personal nutrition goals
5. Search for food
6. Find nutritional information for food
7. Add food to their daily intake
8. Track calories and protein
9. View daily progress
10. View historical intake
11. Create/update/delete food entries
12. Track daily calorie and protein targets
13. Customize their profile and nutrition settings
14. Eventually view statistics and trends

The architecture should allow the application to grow beyond basic calorie/protein tracking.

---

# 3. Authentication Requirements

Authentication is very important.

Design a secure authentication architecture.

## Signup flow

When a new user signs up:

1. User submits:
   - Name
   - Email
   - Password
   - Any required initial profile information

2. Validate the input.

3. Hash the password securely.

4. Create the user in the database.

5. Generate an email verification token.

6. Send the verification token/link to the user's email.

7. The user clicks the verification link.

8. The application verifies the token.

9. The user's email becomes verified.

10. Only then should the user be allowed to access functionality that requires a verified account.

Use **JWT tokens for the email verification mechanism**.

Important:

- Explain whether the verification JWT should be stored in the database, represented by a hashed token, or handled differently.
- Explain token expiration.
- Explain how token reuse should be prevented.
- Explain how expired verification tokens should be handled.
- Explain how a user can request another verification email.
- Explain the security implications of putting verification data in URLs.
- Do not store passwords in plaintext.
- Do not trust client-side authentication state for authorization.

## Login

After successful login:

- Authenticate the user.
- Verify password.
- Check account status.
- Check email verification status.
- Create an authenticated JWT/session mechanism.
- Prefer secure HTTP-only cookies for authentication tokens.
- Explain:
  - Cookie configuration
  - expiration
  - refresh/session strategy
  - logout
  - token invalidation/revocation strategy

The architecture should make it difficult for a malicious client to impersonate another user's role or identity.

---

# 4. Nutrition / Personalization Features

Before implementation, propose what the application should support.

At minimum, consider:

## User profile

- Name
- Email
- Age
- Gender/sex if needed for calculations
- Height
- Weight
- Activity level
- Goal

## Goals

Potential goals:

- Lose weight
- Maintain weight
- Gain weight
- Build muscle

## Nutrition targets

Allow the application to calculate or configure:

- Daily calorie target
- Daily protein target

Potentially later:

- Carbohydrates
- Fat
- Fiber
- Sugar
- Sodium
- Other micronutrients

Explain whether calorie/protein goals should initially be:

- manually entered,
- automatically calculated,
- or support both.

If automatic calculation is recommended, explain the formula/approach that should be used.

Do not overcomplicate the first version.

Clearly separate:

### MVP features

from

### Future features

---

# 5. Food Tracking

Design the data and application flow for food tracking.

A user should be able to:

- Search food
- View nutrition information
- Select serving size
- Enter quantity
- Add food to a meal
- Edit quantity
- Delete food
- View daily totals

Potential meal categories:

- Breakfast
- Lunch
- Dinner
- Snacks

The architecture should support custom meal categories later.

For each food entry, consider storing:

- Food name
- Calories
- Protein
- Serving size
- Quantity
- Unit
- Meal type
- Date
- User
- Source of nutrition data

Explain whether we should store a snapshot of nutrition values at the time the food is logged instead of relying permanently on external API data.

---

# 6. Nutrition Data Source / API

I need genuine nutritional data.

Research and recommend reliable food/nutrition APIs or databases.

Examples to investigate include:

- USDA FoodData Central
- Open Food Facts
- Nutritionix
- Edamam
- Other reputable nutrition APIs/databases

For each recommended source, explain:

- Data quality
- Reliability
- API availability
- Free tier
- Rate limits
- Authentication requirements
- Commercial usage restrictions
- Food coverage
- Whether branded foods are supported
- Whether generic foods are supported
- Whether serving sizes are supported

Prefer authoritative/genuine nutritional data.

Recommend the best option for this project and explain why.

If multiple APIs should be supported, propose an abstraction such as:

FoodDataProvider

so the application does not become tightly coupled to one external API.

Do not hardcode API-specific logic throughout the application.

---

# 7. IMPORTANT — Architecture Requirement

I want a strict separation between:

### UI

↓

### Server Action

↓

### Service Layer

↓

### Prisma

↓

### PostgreSQL

This architecture is extremely important.

---

# 8. Service Layer

All database-related operations should go through service classes.

Do NOT directly call Prisma from UI components or Server Actions.

Example conceptual structure:

```ts
class ProteinService {
  async getDailyProtein(...) {}

  async createProteinEntry(...) {}

  async updateProteinEntry(...) {}

  async deleteProteinEntry(...) {}
}
```

Similarly, create appropriate services such as:

```text
UserService
AuthService
FoodService
MealService
NutritionService
GoalService
ProfileService
VerificationService
DashboardService
```

Determine the appropriate services based on the final domain model.

Services should:

- Be class-based
- Encapsulate business/data-access logic
- Accept explicit arguments
- Interact with Prisma where database access is required
- Avoid knowing about UI concerns
- Avoid directly handling form-specific concerns

Explain what responsibility belongs in each service.

---

# 9. Server Actions

Mutations coming from the frontend should go through Server Actions.

Expected flow:

```text
Form / Client Component
        ↓
Server Action
        ↓
Validation
        ↓
Authorization
        ↓
Service
        ↓
Prisma
        ↓
Database
```

For example:

```text
CreateFoodEntryAction
        ↓
validate input
        ↓
verify authenticated user
        ↓
FoodService.create(...)
        ↓
Prisma
        ↓
Database
```

The Server Action should be responsible for:

- Receiving form/input data
- Parsing data
- Validation
- Authentication checks
- Authorization checks
- Calling the appropriate service
- Cache invalidation
- Returning an appropriate result/error state

The Service should be responsible for:

- Business/data-access logic
- Prisma operations
- Database transactions where required

---

# 10. Cache Invalidation

This is another important architectural requirement.

Cache invalidation should happen in the **Server Action**, not inside the Service.

For example:

```text
Action
 ├── validate
 ├── authorize
 ├── Service.create()
 └── revalidatePath / updateTag
```

Do not put Next.js cache invalidation logic inside domain/database services.

Explain the caching strategy you recommend for:

- Dashboard
- Daily nutrition summary
- Food history
- User profile
- Goals
- Food search
- External API data

Explain when to use:

- `revalidatePath`
- `revalidateTag`
- `updateTag`
- Dynamic rendering
- Request memoization
- Other relevant Next.js caching mechanisms

Avoid caching user-specific sensitive information incorrectly.

---

# 11. Validation

Recommend a validation strategy.

Prefer:

```text
Zod
```

if appropriate.

Explain where validation should happen.

For example:

```text
Client
  ↓
basic UX validation

Server Action
  ↓
authoritative validation

Service
  ↓
business invariants
```

The server must never trust client-side validation.

---

# 12. Database Design

Design a normalized Prisma/PostgreSQL schema.

At minimum investigate entities such as:

```text
User
UserProfile
VerificationToken
Food
FoodNutrition
Meal
FoodEntry
DailyNutrition
NutritionGoal
```

Do not blindly create these tables.

Analyze the domain and determine the best schema.

For each model explain:

- Purpose
- Important fields
- Primary key
- Foreign keys
- Relationships
- Unique constraints
- Indexes
- Nullable fields
- Enums
- Cascade behavior
- Whether timestamps are required

Pay special attention to indexes for:

- User ID
- Date
- Food search
- Food entries
- Meal history

Explain how the schema should scale as the amount of food history grows.

---

# 13. Transactions

Identify operations that should use Prisma transactions.

For example:

```text
Create user
+
Create profile
+
Create initial goals
```

or:

```text
Create meal
+
Create food entries
+
Update daily totals
```

Explain where transactions are required and why.

Avoid unnecessary transactions.

---

# 14. Folder Structure

Design a clean scalable Next.js App Router folder structure.

It should clearly separate:

- Routes
- UI components
- Server Actions
- Services
- Database
- Authentication
- Validation
- Types
- Utilities
- API integrations
- Configuration

Example concept:

```text
src/
├── app/
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── api/
│   ├── ...
│
├── actions/
├── services/
├── components/
├── lib/
├── db/
├── schemas/
├── types/
├── providers/
├── config/
└── ...
```

However, do not simply copy this structure.

Analyze the project and propose the best structure.

Explain why each major directory exists.

Also explain the routing structure.

---

# 15. Route Design

Design the application routes.

Potential routes:

```text
/login
/signup
/verify-email
/forgot-password
/reset-password

/dashboard

/food
/food/search

/meals
/meals/[mealId]

/history

/goals

/profile
/settings
```

Determine which routes should actually exist for the MVP.

Explain:

- Public routes
- Protected routes
- Auth-only routes
- Route groups
- Dynamic routes
- Loading states
- Error boundaries
- Not-found handling

---

# 16. Authorization

Design authorization carefully.

The user must only be able to access their own:

- Profile
- Goals
- Meals
- Food entries
- Nutrition history
- Dashboard

Never rely on:

```text
localStorage
sessionStorage
client-side role values
```

for authorization.

Authorization must happen on the server.

Explain how the authenticated user ID should flow through:

```text
Request
↓
Authentication
↓
Server Action
↓
Service
↓
Database query
```

and how to prevent IDOR-style vulnerabilities where a user modifies another user's records by changing an ID.

---

# 17. Error Handling

Design a consistent error-handling strategy.

Consider:

```text
AppError
ValidationError
AuthenticationError
AuthorizationError
NotFoundError
ConflictError
ExternalApiError
DatabaseError
```

Explain:

- Where errors should be created
- Where they should be caught
- What should be returned to the UI
- What should be logged
- What should never be exposed to the client

Do not expose sensitive database or authentication errors.

---

# 18. External API Architecture

If a nutrition API is used, design an abstraction such as:

```text
FoodDataProvider
```

with implementations such as:

```text
USDAFoodDataProvider
OpenFoodFactsProvider
```

The application services should depend on the abstraction rather than directly depending on one vendor.

Explain whether this abstraction is actually justified for the MVP or whether it should be introduced later.

---

# 19. Dashboard

Propose the dashboard architecture.

Potential information:

```text
Today's Calories
████████░░ 80%

Today's Protein
██████░░░░ 60%

Calories Remaining
Protein Remaining

Breakfast
Lunch
Dinner
Snacks

Recent Foods

Weekly Statistics
```

Also consider:

- Daily progress
- Weekly averages
- Goal completion
- Weight trend
- Protein consistency
- Calorie consistency

Separate MVP dashboard functionality from advanced analytics.

---

# 20. UI/UX Requirements

Use Tailwind CSS.

The application should be:

- Clean
- Modern
- Minimal
- Responsive
- Accessible
- Mobile-first

Every page should work properly on:

```text
320px+
mobile
tablet
laptop
desktop
large desktop
```

Consider reusable components such as:

```text
Button
Input
Modal
Dialog
Card
ProgressBar
FoodCard
MealCard
NutritionSummary
LoadingState
EmptyState
ErrorState
```

Avoid duplicating UI logic.

---

# 21. Security Requirements

Include a security plan covering:

- Password hashing
- JWT security
- HTTP-only cookies
- Secure cookies
- SameSite configuration
- CSRF considerations
- Email verification
- Token expiration
- Rate limiting
- Brute-force protection
- Input validation
- SQL injection protection
- XSS prevention
- Authorization
- IDOR prevention
- Sensitive environment variables
- API key protection
- Secure external API usage

Do not expose private API keys to client-side code.

---

# 22. Environment Configuration

Define required environment variables.

For example:

```text
DATABASE_URL
JWT_SECRET
AUTH_SECRET
EMAIL_SERVER
EMAIL_FROM
NUTRITION_API_KEY
NUTRITION_API_URL
```

Do not blindly use these exact names if the architecture suggests better naming.

Explain:

- Development environment
- Production environment
- `.env.local`
- `.env.example`
- Which variables are server-only
- Which variables, if any, may be public

Never expose secrets through `NEXT_PUBLIC_*`.

---

# 23. Email Verification Architecture

Design the complete email verification flow.

Example:

```text
Signup
 ↓
Create User
 ↓
Generate verification JWT
 ↓
Send email
 ↓
User clicks link
 ↓
/verify-email?token=...
 ↓
Verify JWT
 ↓
Check expiration
 ↓
Check user
 ↓
Mark emailVerified
 ↓
Invalidate/revoke token
 ↓
Redirect to login/dashboard
```

Explain whether the JWT itself should be stored or whether a hash/reference should be stored.

Design this securely.

---

# 24. Testing Strategy

Provide a testing strategy for:

### Unit tests

- Services
- Utility functions
- Nutrition calculations
- Validation schemas

### Integration tests

- Prisma/database operations
- Authentication
- Server Actions

### End-to-end tests

- Signup
- Email verification
- Login
- Add food
- Update food
- Delete food
- Daily tracking

Recommend appropriate tools.

---

# 25. Logging / Monitoring

Recommend a basic production logging strategy.

Explain:

- What should be logged
- What should not be logged
- Authentication events
- External API failures
- Database errors
- Unexpected application errors

Do not log passwords, JWTs, tokens, or sensitive personal information.

---

# 26. Development Phases

Break implementation into clear phases.

For example:

```text
Phase 1 — Project setup
Phase 2 — Database architecture
Phase 3 — Authentication
Phase 4 — Email verification
Phase 5 — User profile
Phase 6 — Nutrition goals
Phase 7 — Food API integration
Phase 8 — Food tracking
Phase 9 — Dashboard
Phase 10 — History/statistics
Phase 11 — Validation/error handling
Phase 12 — Testing
Phase 13 — Performance/security
Phase 14 — Deployment
```

You may change these phases if a better dependency order exists.

For every phase explain:

- What will be implemented
- Dependencies
- Files/modules involved
- Database changes
- Important architectural decisions
- Testing required
- Definition of done

---

# 27. MVP vs Future Features

Clearly divide the product into:

## MVP

Only features necessary to launch a solid first version.

## V2

Useful improvements after MVP.

## Future / Advanced

Potential features such as:

- AI meal recommendations
- Barcode scanning
- Recipe nutrition calculation
- Meal planning
- Grocery lists
- Weight tracking
- Body measurements
- Progress charts
- Macro tracking
- Micronutrient tracking
- Personalized recommendations
- Notifications/reminders
- Mobile/PWA support
- Social/community features
- Admin dashboard
- Subscription features

Do not let future features unnecessarily complicate the MVP architecture.

---

# 28. Important Architectural Rules

These rules must be respected throughout the project:

### Rule 1

Never directly use Prisma from React components.

### Rule 2

Database operations belong in Service classes.

### Rule 3

Services must be class-based.

Example:

```ts
class FoodService {
  async createFood(...) {}
  async getFood(...) {}
  async updateFood(...) {}
  async deleteFood(...) {}
}
```

### Rule 4

Mutations from the UI should go through Server Actions.

### Rule 5

Server Actions call Services.

### Rule 6

Cache invalidation belongs in Server Actions.

### Rule 7

Authentication and authorization must happen server-side.

### Rule 8

Client-side state must never be treated as proof of authorization.

### Rule 9

Use TypeScript strictly.

### Rule 10

Keep business logic out of UI components.

### Rule 11

Use reusable components instead of duplicated UI.

### Rule 12

Keep external API/vendor-specific logic isolated.

### Rule 13

Validate all untrusted input on the server.

### Rule 14

Use transactions only when atomicity is required.

### Rule 15

Prefer maintainability and clear separation of concerns over premature abstraction.

---

# 29. What I Want From You Now

Again, **DO NOT WRITE THE APPLICATION CODE YET.**

I want you to produce the following planning document:

## A. Architecture Overview

Explain the complete architecture.

## B. Recommended Technology Stack

List every major technology/library and explain why it is needed.

## C. Database Architecture

Provide the proposed Prisma models and relationships.

Do not generate the complete `schema.prisma` yet unless necessary for explaining the design.

## D. Authentication Architecture

Explain signup → email verification → login → session → logout.

## E. Service Architecture

List every service class and its responsibilities.

## F. Server Action Architecture

List the actions and explain what each one does.

## G. Folder Structure

Provide the complete proposed folder structure.

## H. Route Structure

Provide the route hierarchy.

## I. Nutrition API Recommendation

Compare reliable APIs and recommend the best option.

## J. Caching Strategy

Explain exactly where caching and invalidation should happen.

## K. Security Architecture

Explain authentication, authorization, JWT, cookies, CSRF, rate limiting, and IDOR prevention.

## L. MVP Feature List

Clearly define what should be implemented first.

## M. Future Feature List

Identify features that should intentionally be postponed.

## N. Development Roadmap

Provide a sequential implementation plan.

## O. Dependency Graph

Explain which components depend on which other components.

For example:

```text
Database
   ↓
Services
   ↓
Server Actions
   ↓
UI
```

and:

```text
Authentication
   ↓
Authorization
   ↓
Protected Services/Actions
   ↓
Application Features
```

## P. Potential Problems

Identify architectural problems or decisions that should be resolved before implementation.

## Q. Recommended First Implementation Step

At the end, tell me exactly what we should implement first and why.

---

# Final Constraint

Do not start coding.

Do not generate boilerplate files.

Do not generate the Prisma schema yet.

Do not generate components yet.

Do not create the application.

**Only provide the architecture/setup plan and implementation roadmap.**

The plan should be detailed enough that after reviewing it, I can tell you to proceed with Phase 1 and implement the project incrementally.
