import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { commissionControllers } from "./commission.controller";

const router = Router();
router.get(
  "/all-agent-com",
  checkAuth(Role.ADMIN),
  commissionControllers.getAllCommission
);
router.get(
  "/agent-com",
  checkAuth(Role.AGENT),
  commissionControllers.getAllCommissionByUserID,

);

export const CommissionRoutes = router;
