import { Router } from "express";
import { getOrderDeliveryOptionsHandler } from "../controllers/orderDeliveryOptions.js";

const router = Router();
router.get("/", getOrderDeliveryOptionsHandler);

export default router;
