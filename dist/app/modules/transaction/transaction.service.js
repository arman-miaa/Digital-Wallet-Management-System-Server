"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const transaction_model_1 = require("./transaction.model");
const createTransaction = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionPayload = Object.assign({}, payload);
    const transaction = yield transaction_model_1.TransactionModel.create(transactionPayload);
    return transaction;
});
const getAllTransactionByUserID = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.TransactionModel.find({ user: user_id }).sort({
        createdAt: -1,
    });
    const totalTransaction = yield transaction_model_1.TransactionModel.countDocuments({ user: user_id });
    return {
        data: transactions,
        meta: {
            total: totalTransaction,
        },
    };
});
const getAllTransaction = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.TransactionModel.find({}).sort({
        createdAt: -1,
    });
    const totalTransaction = yield transaction_model_1.TransactionModel.countDocuments();
    return {
        data: transactions,
        meta: {
            total: totalTransaction,
        },
    };
});
exports.TransactionService = {
    createTransaction,
    getAllTransaction,
    getAllTransactionByUserID,
};
