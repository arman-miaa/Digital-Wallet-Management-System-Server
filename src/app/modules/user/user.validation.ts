import { z } from "zod";

export const createUserZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    phone: z
      .string()
      .min(11, "Phone number must be at least 11 digits")
      .optional()
      .nullable(),

    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "agent", "user"]).default("user"),
    status: z.enum(["active", "blocked", "pending"]).default("active"),
  }),
});
