"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletTransferZodSchema = exports.WalletBalanceWithdrawZodSchema = exports.WalletBalanceAddZodSchema = void 0;
const zod_1 = require("zod");
exports.WalletBalanceAddZodSchema = zod_1.z.object({
    user_id: zod_1.z.string({ required_error: "User ID is required" }),
    amount: zod_1.z.number().nonnegative().default(0),
});
exports.WalletBalanceWithdrawZodSchema = zod_1.z.object({
    agent_id: zod_1.z.string({ required_error: "Agent ID is required" }),
    amount: zod_1.z.number().nonnegative().default(0),
});
exports.WalletTransferZodSchema = zod_1.z.object({
    receiver_id: zod_1.z.string({ required_error: "User ID is required" }),
    amount: zod_1.z.number().nonnegative().default(0),
});
