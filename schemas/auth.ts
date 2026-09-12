import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password.").max(128, "Invalid password."),
});

export type LoginInput = z.infer<typeof LoginSchema>;
