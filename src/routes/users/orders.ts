import { Router } from "express";
import {
  postUserOrderHandler,
  getUserOrdersHandler,
  getUserOrderByIdHandler,
} from "../../controllers/users/userOrders.js";

const router = Router();
router.post("/", postUserOrderHandler);
router.get("/", getUserOrdersHandler);
router.get("/:id", getUserOrderByIdHandler);

export default router;
