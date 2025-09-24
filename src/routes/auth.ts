import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  verifyEmailHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  resendVerificationEmailHandler,
} from "../controllers/auth.js";

const router = Router();
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.post("/verify-email", verifyEmailHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);
router.post("/resend-verification-email", resendVerificationEmailHandler);

export default router;
