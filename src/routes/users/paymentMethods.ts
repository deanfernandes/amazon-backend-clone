import { Router } from "express";
import {
  postUserPaymentMethodHandler,
  getUserPaymentMethodsHandler,
  getUserPaymentMethodHandler,
  putUserPaymentMethodHandler,
  deleteUserPaymentMethodHandler,
} from "../../controllers/users/userPaymentMethods.js";

const router = Router({ mergeParams: true });
router.post("/", postUserPaymentMethodHandler);
router.get("/", getUserPaymentMethodsHandler);
router.get("/:id", getUserPaymentMethodHandler);
router.put("/:id", putUserPaymentMethodHandler);
router.patch("/:id", (req, res) => {});
router.delete("/:id", deleteUserPaymentMethodHandler);

export default router;
