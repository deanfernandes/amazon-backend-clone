import { Router } from "express";
import { postProductHandler } from "../../controllers/products/products.js";

const router = Router();
router.post("/", postProductHandler);
router.get("/", (req, res) => {});
router.get("/:id", (req, res) => {});
router.put("/:id", (req, res) => {});
router.patch("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

export default router;
