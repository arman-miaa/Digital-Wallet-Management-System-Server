import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";

// import { IUserRole } from "../user/user.interface";
import passport from "passport";
// import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

router.post("/login", AuthControllers.credentialsLogin);
router.post("/refresh-token", AuthControllers.getNewAccessToken);

// router.post(
//   "/reset-password",
//   authMiddleware(...Object.values(IUserRole)),
//   AuthControllers.resetPassword
// );

// /booking -> /login -> successful google login -> /booking frontend
//  /login  -> successful google login -> /frontend
router.get("/google", (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.query.redirect || "/";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: redirect as string,
  })(req, res, next);
});



export const AuthRoutes = router;
