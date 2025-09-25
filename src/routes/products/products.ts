import { Router } from "express";
import {
  postProductHandler,
  getProductsHandler,
  getProductHandler,
  putProductHandler,
  deleteProductHandler,
} from "../../controllers/products/products.js";

const router = Router();
router.post("/", postProductHandler);
router.get("/", getProductsHandler);
router.get("/:id", getProductHandler);
router.put("/:id", putProductHandler);
router.patch("/:id", (req, res) => {});
router.delete("/:id", deleteProductHandler);

export default router;
