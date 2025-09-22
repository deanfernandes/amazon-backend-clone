import { Router } from "express";

const router = Router({ mergeParams: true });

router.post("/", (req, res) => {});
router.get("/", (req, res) => {});
router.delete("/:productId", (req, res) => {});
router.get("/:productId", (req, res) => {});

export default router;
