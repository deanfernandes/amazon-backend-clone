import { Router } from "express";
import authRouter from "./auth.js";
import usersRouter from "./users/users.js";
import productsRouter from "./products.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/products", productsRouter);

export default router;
