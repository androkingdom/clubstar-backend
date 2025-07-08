import { z } from "zod";
import reservedUsernames from "../constants/reservedUsernames.json";

export const UserRegistrationSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username can't be longer than 20 characters")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "Only letters, numbers, underscores, and dots allowed"
    )
    .refine((val) => !val.includes("@"), {
      message: "Username cannot be an email address",
    })
    .refine((val) => !reservedUsernames.includes(val.toLowerCase()), {
      message: "Username is reserved",
    }),

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
