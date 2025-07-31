import express from "express";
import {
  createTransaction,
  getAllTransactions,
} from "./transaction.controller";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", getAllTransactions);

export const TransactionRoutes = router;
