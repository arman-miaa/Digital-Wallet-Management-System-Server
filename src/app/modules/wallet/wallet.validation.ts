import { z } from "zod";

export const WalletBalanceAddZodSchema = z.object({
  user_id: z.string({ required_error: "User ID is required" }),
  amount: z.number().nonnegative().default(0),
});
export const WalletBalanceWithdrawZodSchema = z.object({
  agent_id: z.string({ required_error: "Agent ID is required" }),
  amount: z.number().nonnegative().default(0),
});
export const WalletTransferZodSchema = z.object({
  receiver_id: z.string({ required_error: "User ID is required" }),
  amount: z.number().nonnegative().default(0),
});

