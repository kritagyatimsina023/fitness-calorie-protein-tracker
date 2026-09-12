import { AppError } from "./app-error";

type Resource = AppError["resource"];

export const Errors = {
  validation: (message: string, resource: Resource) =>
    new AppError(message, "VALIDATION", 422, resource),
  unauthorized: (message: string, resource: Resource) =>
    new AppError(message, "UNAUTHORIZED", 401, resource),
  forbidden: (message: string, resource: Resource) =>
    new AppError(message, "FORBIDDEN", 403, resource),
  notFound: (message: string, resource: Resource) =>
    new AppError(message, "NOT_FOUND", 404, resource),
  conflict: (message: string, resource: Resource) =>
    new AppError(message, "CONFLICT", 409, resource),
  badRequest: (message: string, resource: Resource) =>
    new AppError(message, "BAD_REQUEST", 400, resource),
  internal: (message: string, resource: Resource) =>
    new AppError(message, "INTERNAL", 500, resource),
};
