import { z } from "zod";

const blockWallet = z.object({
  walletId: z.string({ required_error: "Wallet ID is required" }),
  isBlocked: z.boolean({ required_error: "Blocked status is required" }),
});

const approveAgent = z.object({
  agentId: z.string({ required_error: "Agent ID is required" }),
  status: z.enum(["approved", "suspended", "pending"], {
    required_error: "Status is required",
  }),
});

export const adminValidation = {
  blockWallet,
  approveAgent,
};
