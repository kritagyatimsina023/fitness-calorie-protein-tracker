import { Prisma } from "@/generated/prisma/client";

import type { ErrorCode } from "./error-codes";
import type { ErrorResource } from "./error-resources";
import { AppError } from "./app-error";

export type SafeError = {
  code: ErrorCode;
  message: string;
  resource?: ErrorResource;
};

export function handleError(error: unknown): SafeError {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      resource: error.resource,
    };
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      code: "CONFLICT",
      message: "A nutrition goal already exists for this date.",
    };
  }

  console.error("Unexpected error", error);

  return {
    code: "INTERNAL",
    message: "Something went wrong. Please try again.",
  };
}
