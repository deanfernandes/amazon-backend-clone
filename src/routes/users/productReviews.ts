import { Router } from "express";
import {
  getProductReviewsHandler,
  putProductReviewHandler,
  deleteProductReviewHandler,
} from "../../controllers/users/productReviews.js";

const router = Router({ mergeParams: true });
router.get("/", getProductReviewsHandler);
router.put("/:id", putProductReviewHandler);
router.delete("/:id", deleteProductReviewHandler);

export default router;
