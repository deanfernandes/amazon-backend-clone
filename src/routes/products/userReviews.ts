import { Router } from "express";
import { getUserReviewsHandler } from "../../controllers/products/userReviews.js";

const router = Router({ mergeParams: true });
router.get("/", getUserReviewsHandler);

export default router;
