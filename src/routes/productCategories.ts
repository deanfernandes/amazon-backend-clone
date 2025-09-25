import { Router } from "express";
import { getProductCategoriesHandler } from "../controllers/productCategories.js";

const router = Router();
router.get("/", getProductCategoriesHandler);

export default router;
