import { z } from "zod";

export const createTransactionZodSchema = z.object({
  body: z.object({
    amount: z.number().min(1),
    from: z.string().optional(),
    to: z.string().optional(),
    type: z.enum(["add", "withdraw", "transfer","cashin","cashout","RECEIVE"]),
    status: z.enum(["success", "failed"]).optional(),
  }),
});
