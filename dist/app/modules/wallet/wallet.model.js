"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = void 0;
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 50 },
    status: { type: String, enum: ["ACTIVE", "BLOCKED"], default: "ACTIVE" },
}, { timestamps: true, versionKey: false });
exports.WalletModel = (0, mongoose_1.model)("Wallet", WalletSchema);
