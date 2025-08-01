import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";

import { TransactionRoutes } from "../modules/transaction/transaction.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { AdminRoutes } from "../modules/admin/admin.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/wallet",
    route: WalletRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/transaction",
    route: TransactionRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
