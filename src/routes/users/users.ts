import { Router } from "express";
import addressesRouter from "./addresses.js";
import paymentMethodsRouter from "./paymentMethods.js";
import wishlistRouter from "./wishlist.js";
import {
  postUserHandler,
  getUsersHandler,
  getUserHandler,
  putUserHandler,
  deleteUserHandler,
} from "../../controllers/users/users.js";

const router = Router();
router.post("/", postUserHandler);
router.get("/", getUsersHandler);
router.get("/:id", getUserHandler);
router.put("/:id", putUserHandler);
router.patch("/:id", (req, res) => {});
router.delete("/:id", deleteUserHandler);
router.use("/:userId/addresses", addressesRouter);
router.use("/:userId/payment-methods", paymentMethodsRouter);
router.use("/:userId/wishlist", wishlistRouter);

export default router;
