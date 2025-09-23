import { Router } from "express";
import addressesRouter from "./addresses.js";
import paymentMethodsRouter from "./payment-methods.js";
import wishlistRouter from "./wishlist.js";
import {
  createUserHandler,
  getUsersHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "../../controllers/users.js";

const router = Router();
router.post("/", createUserHandler);
router.get("/", getUsersHandler);
router.get("/:id", getUserHandler);
router.put("/:id", updateUserHandler);
router.patch("/:id", (req, res) => {});
router.delete("/:id", deleteUserHandler);
router.use("/:userId/addresses", addressesRouter);
router.use("/:userId/payment-methods", paymentMethodsRouter);
router.use("/:userId/wishlist", wishlistRouter);

export default router;
