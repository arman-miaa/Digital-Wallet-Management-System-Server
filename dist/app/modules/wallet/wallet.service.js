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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const commission_service_1 = require("../commission/commission.service");
const transaction_interface_1 = require("../transaction/transaction.interface");
const transaction_service_1 = require("../transaction/transaction.service");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const getMylWallet = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.WalletModel.find({ user: user_id }).sort({
        createdAt: -1,
    });
    return {
        data: wallet,
    };
});
const getAllWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield wallet_model_1.WalletModel.find({});
    const totalTransaction = yield wallet_model_1.WalletModel.countDocuments();
    return {
        data: transactions,
        meta: {
            total: totalTransaction,
        },
    };
});
const addMoney = (user_id, agent_id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0)
        throw new AppError_1.default(400, "Invalid amount");
    const userWallet = yield wallet_model_1.WalletModel.findOne({ user: user_id });
    const agentWallet = yield wallet_model_1.WalletModel.findOne({ user: agent_id });
    const userModel = yield user_model_1.UserModel.findById(agent_id);
    if (!userModel || userModel.role !== "USER")
        throw new AppError_1.default(404, "This account is not register as USER");
    if (!userWallet || !agentWallet)
        throw new AppError_1.default(404, "Wallet not found");
    if (userWallet.status === "BLOCKED" || agentWallet.status === "BLOCKED")
        throw new AppError_1.default(403, "Wallet is blocked");
    if (agentWallet.balance < amount) {
        throw new AppError_1.default(422, "Insufficient Balance");
    }
    agentWallet.balance -= amount;
    userWallet.balance += amount;
    yield agentWallet.save();
    yield userWallet.save();
    yield transaction_service_1.TransactionService.createTransaction({
        user: user_id,
        agent: agent_id,
        amount,
        type: transaction_interface_1.TransactionType.ADD,
        status: transaction_interface_1.TransactionStatus.COMPLETED,
    });
    return {
        userWallet,
        agentWallet,
    };
});
const withdrawMoney = (user_id, agent_id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0)
        throw new AppError_1.default(400, "Invalid amount");
    const userWallet = yield wallet_model_1.WalletModel.findOne({ user: user_id });
    const agentWallet = yield wallet_model_1.WalletModel.findOne({ user: agent_id });
    const agentModel = yield user_model_1.UserModel.findById(agent_id);
    if (!agentModel || agentModel.role !== "AGENT")
        throw new AppError_1.default(404, "This account is not register as AGENT");
    if (!userWallet || !agentWallet)
        throw new AppError_1.default(404, "Wallet not found");
    if (userWallet.status === "BLOCKED" || agentWallet.status === "BLOCKED")
        throw new AppError_1.default(403, "Wallet is blocked");
    const { transaction_fee, agent_commission } = yield (0, commission_service_1.WithdrawCommission)(agent_id, amount);
    const totalDeductionUser = amount + transaction_fee;
    const totalDeductionAgent = amount + agent_commission;
    console.log("agent_commission", agent_commission);
    console.log("totalDeductionAgent", totalDeductionAgent);
    if (userWallet.balance < totalDeductionUser) {
        throw new AppError_1.default(422, "Insufficient Balance including transaction fee");
    }
    yield transaction_service_1.TransactionService.createTransaction({
        user: user_id,
        agent: agent_id,
        amount,
        transaction_fee: transaction_fee,
        type: transaction_interface_1.TransactionType.WITHDRAW,
        status: transaction_interface_1.TransactionStatus.COMPLETED,
    });
    agentWallet.balance += totalDeductionAgent;
    userWallet.balance -= totalDeductionUser;
    yield agentWallet.save();
    yield userWallet.save();
    return {
        userWallet,
        agentWallet,
        withdrawMoney: totalDeductionUser,
        transactionFee: transaction_fee,
    };
});
const transferMoney = (sender_id, receiver_id, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0)
        throw new AppError_1.default(400, "Invalid amount");
    const senderWallet = yield wallet_model_1.WalletModel.findOne({ user: sender_id });
    const receiverWallet = yield wallet_model_1.WalletModel.findOne({ user: receiver_id });
    const userModel = yield user_model_1.UserModel.findById(receiver_id);
    if (!userModel || userModel.role !== "USER")
        throw new AppError_1.default(404, "This account is not register as USER");
    if (!senderWallet || !receiverWallet)
        throw new AppError_1.default(404, "Wallet not found");
    if (senderWallet.status === "BLOCKED" || receiverWallet.status === "BLOCKED")
        throw new AppError_1.default(403, "Wallet is blocked");
    const { transaction_fee } = yield (0, commission_service_1.TransferFee)(amount);
    const totalDeduction = amount + transaction_fee;
    if (senderWallet.balance < totalDeduction) {
        throw new AppError_1.default(422, "Insufficient Balance including transaction fee");
    }
    yield transaction_service_1.TransactionService.createTransaction({
        user: sender_id,
        agent: receiver_id,
        amount,
        transaction_fee: totalDeduction,
        type: transaction_interface_1.TransactionType.TRANSFER,
        status: transaction_interface_1.TransactionStatus.COMPLETED,
    });
    receiverWallet.balance += amount;
    senderWallet.balance -= totalDeduction;
    yield receiverWallet.save();
    yield senderWallet.save();
    return {
        senderWallet,
        receiverWallet,
        transferMoney: totalDeduction,
        transactionFee: transaction_fee,
    };
});
const updateWallet = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.WalletModel.findOne({ user: userId });
    if (!wallet)
        throw new AppError_1.default(404, "Wallet not found");
    if (wallet.status === "BLOCKED") {
        const isOnlyStatusUpdate = Object.keys(payload).length === 1 && "status" in payload;
        if (!isOnlyStatusUpdate) {
            throw new AppError_1.default(403, "Blocked wallet can only be updated to change status.");
        }
    }
    const updatedWallet = yield wallet_model_1.WalletModel.findOneAndUpdate({ user: userId }, payload, {
        new: true,
        runValidators: true,
    });
    return updatedWallet;
});
exports.WalletService = {
    addMoney,
    getMylWallet,
    getAllWallet,
    withdrawMoney,
    transferMoney,
    updateWallet,
};
