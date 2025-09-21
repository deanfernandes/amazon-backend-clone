import { Router } from "express";
import addressesRouter from "./addresses.js";
import paymentMethodsRouter from "./payment-methods.js";

const router = Router();
router.post("/", (req, res) => {});
router.get("/", (req, res) => {});
router.get("/:id", (req, res) => {});
router.put("/:id", (req, res) => {});
router.patch("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});
router.use("/:userId/addresses", addressesRouter);
router.use("/:userId/payment-methods", paymentMethodsRouter);

export default router;
