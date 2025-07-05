import { z } from "zod";

export const UserRegistrationSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .min(1, "Email is required"),

  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long"),
});

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;

export const UserAuthSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .min(1, "Email is required"),

  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long"),
});

export type UserAuth = z.infer<typeof UserAuthSchema>;
