export const ErrorResource = {
  AUTH: "AUTH",
  USER: "USER",
  FOOD: "FOOD",
  MEAL: "MEAL",
  NUTRITION: "NUTRITION",
  GOAL: "GOAL",
  PROFILE: "PROFILE",
  FOOD_ENTRY: "FOOD_ENTRY",
  DASHBOARD: "DASHBOARD",
  VERIFICATION: "VERIFICATION",
  EXTERNAL_API: "EXTERNAL_API",
} as const;

export type ErrorResource = (typeof ErrorResource)[keyof typeof ErrorResource];
