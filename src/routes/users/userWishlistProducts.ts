import { Router } from "express";
import {
  postUserWishlistHandler,
  getUserWishlistProductsHandler,
  deleteUserWishlistProductHandler,
} from "../../controllers/users/userWishlistProducts.js";

const router = Router({ mergeParams: true });
router.post("/", postUserWishlistHandler);
router.get("/", getUserWishlistProductsHandler);
router.delete("/:id", deleteUserWishlistProductHandler);

export default router;
