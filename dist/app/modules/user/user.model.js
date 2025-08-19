"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const AuthProviderSchema = new mongoose_1.Schema({
    provider: {
        type: String,
        enum: ["google", "credentials"],
        required: true,
    },
    providerId: {
        type: String,
        required: true,
    },
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    profile_photo: { type: String },
    short_bio: { type: String },
    auths: [AuthProviderSchema],
    is_active: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
    },
    is_verified: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false,
});
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
