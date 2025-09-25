import { Router } from "express";
import {
  postProductHandler,
  getProductsHandler,
} from "../../controllers/products/products.js";

const router = Router();
router.post("/", postProductHandler);
router.get("/", getProductsHandler);
router.get("/:id", (req, res) => {});
router.put("/:id", (req, res) => {});
router.patch("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

export default router;
