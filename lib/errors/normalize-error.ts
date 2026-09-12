import { Prisma } from "@/generated/prisma/client";
import { ZodError } from "zod";
import { AppError } from "./app-error";
import { Errors } from "./errors";

export function normalizeError(
  error: unknown,
  resource: AppError["resource"],
): AppError {
  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    return Errors.validation(
      error.issues[0]?.message ?? "Invalid input.",
      resource,
    );
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = error.meta?.target;

    if (
      Array.isArray(target) &&
      target.includes("userId") &&
      target.includes("effectiveFrom")
    ) {
      return Errors.conflict(
        "A nutrition goal already exists for this date.",
        resource,
      );
    }
    return Errors.conflict("A record for this date exist.", resource);
  }

  // if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //   if (error.code === "P2002")
  //     return Errors.conflict(
  //       "A record with this information already exists.",
  //       resource,
  //     );
  //   if (error.code === "P2025")
  //     return Errors.notFound("The requested record was not found.", resource);
  // }

  console.error(`[${resource}] Unexpected error`, error);
  return Errors.internal("Something went wrong. Please try again.", resource);
}
