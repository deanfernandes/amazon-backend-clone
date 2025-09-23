import { Router } from "express";
import {
  postUserPaymentMethodHandler,
  getUserPaymentMethodsHandler,
  getUserPaymentMethodHandler,
} from "../../controllers/users/paymentMethods.js";

const router = Router({ mergeParams: true });
router.post("/", postUserPaymentMethodHandler);
router.get("/", getUserPaymentMethodsHandler);
router.get("/:id", getUserPaymentMethodHandler);
router.put("/:id", (req, res) => {});
router.patch("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

export default router;
