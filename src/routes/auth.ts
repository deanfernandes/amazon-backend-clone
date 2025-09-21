import { Router } from "express";

const router = Router();
router.post("/register", (req, res) => {});
router.post("/login", (req, res) => {});
router.post("/logout", (req, res) => {});
router.post("/verify-email", (req, res) => {});
router.post("/forgot-password", (req, res) => {});
router.post("/reset-password", (req, res) => {});
router.post("/resend-verification-email", (req, res) => {});

export default router;
