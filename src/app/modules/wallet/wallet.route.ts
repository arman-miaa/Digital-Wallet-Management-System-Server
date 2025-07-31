import express from "express";


import {
  getMyWallet,
  blockWallet,
  depositMoney,
  withdrawMoney,
  sendMoney,
  cashIn,
  cashOut,
} from "./wallet.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.get("/my-wallet", authMiddleware("user", "admin", "agent"), getMyWallet);
router.patch("/block/:id", authMiddleware("admin"), blockWallet);

router.post("/deposit", authMiddleware("user"), depositMoney);
router.post("/withdraw", authMiddleware("user"), withdrawMoney);
router.post("/send-money", authMiddleware("user"), sendMoney);

router.post("/cash-in", authMiddleware("agent"), cashIn);
router.post("/cash-out", authMiddleware("agent"), cashOut);

export const WalletRoutes = router;
