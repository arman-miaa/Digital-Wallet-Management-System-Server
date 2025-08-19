import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { transactionControllers } from "./transaction.controller";
import { Role } from "../user/user.interface";

const router = Router();
router.get(
  "/all-transactions",
  checkAuth(Role.ADMIN),
  transactionControllers.getAllTransaction
);
router.get(
  "/your-transactions",
  checkAuth(Role.USER),
  transactionControllers.getAllTransactionByUserID
);

export const TransRoutes = router;
