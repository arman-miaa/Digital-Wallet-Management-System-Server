import express from "express";

import { AdminController } from "./admin.controller";
import { adminValidation } from "./admin.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/users", AdminController.getAllUsers);
router.get("/agents", AdminController.getAllAgents);
router.get("/wallets", AdminController.getAllWallets);
router.get("/transactions", AdminController.getAllTransactions);
router.patch(
  "/wallets/status",
  validateRequest(adminValidation.blockWallet),
  AdminController.blockUnblockWallet
);

router.patch(
  "/agents/status",
  validateRequest(adminValidation.approveAgent),
  AdminController.approveSuspendAgent
);

export const AdminRoutes = router;
