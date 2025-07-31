import { z } from "zod";



export const createUserZodSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(2),
  email: z.string({ required_error: "Email is required" }).email(),
  phone: z.string().min(11).optional().nullable(),
  password: z.string({ required_error: "Password is required" }).min(6),
  role: z.enum(["admin", "agent", "user"]).default("user"),
  IsActive: z.enum(["active", "blocked", "pending"]).default("active"),
});


