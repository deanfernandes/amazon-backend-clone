import { Router } from "express";
import { getUserSubscriptionPlansHandler } from "../controllers/userSubscriptionPlans.js";

const router = Router({ mergeParams: true });
router.get("/", getUserSubscriptionPlansHandler);

export default router;
