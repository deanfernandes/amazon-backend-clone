import { Router } from "express";
import {
  postUserSubscriptionHandler,
  getUserSubscriptionsHandler,
  deleteUserSubscriptionHandler,
} from "../../controllers/users/userSubscriptions.js";

const router = Router({ mergeParams: true });
router.post("/", postUserSubscriptionHandler);
router.get("/", getUserSubscriptionsHandler);
router.delete("/:id", deleteUserSubscriptionHandler);

export default router;
