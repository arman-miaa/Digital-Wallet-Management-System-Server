"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapitalModel = void 0;
const mongoose_1 = require("mongoose");
const CapitalSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        required: true,
        default: "capital_wallet", // fixed ID for single record
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        versionKey: false
    },
});
exports.CapitalModel = (0, mongoose_1.model)("Capital", CapitalSchema);
