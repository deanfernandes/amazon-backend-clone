import { Router } from "express";
import {
  postUserSubscriptionHandler,
  getUserSubscriptionsHandler,
  deleteUserSubscriptionHandler,
} from "../../controllers/users/userSubscriptions.js";

const router = Router({ mergeParams: true });
router.post("/", postUserSubscriptionHandler);
router.get("/", getUserSubscriptionsHandler);
router.get("/:id", (req, res) => {});
router.put("/:id", (req, res) => {});
router.patch("/:id", (req, res) => {});
router.delete("/:id", deleteUserSubscriptionHandler);

export default router;
