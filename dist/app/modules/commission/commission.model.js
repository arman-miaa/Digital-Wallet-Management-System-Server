"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentCommissionHistoryModel = void 0;
const mongoose_1 = require("mongoose");
const AgentCommissionHistorySchema = new mongoose_1.Schema({
    agent_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    // transaction_id: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    // },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
}, {
    timestamps: true,
    versionKey: false
});
exports.AgentCommissionHistoryModel = (0, mongoose_1.model)("AgentCommissionHistory", AgentCommissionHistorySchema);
