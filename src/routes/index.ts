import { Router } from "express";
import authRouter from "./auth.js";
import usersRouter from "./users/users.js";
import subscriptionPlansRouter from "./subscriptionsPlans.js";
import productsRouter from "./products/products.js";
import productCategoriesRouter from "./productCategories.js";
import orderDeliveryOptionsRouter from "./orderDeliveryOptions.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/subscription-plans", subscriptionPlansRouter);
router.use("/products", productsRouter);
router.use("/product-categories", productCategoriesRouter);
router.use("/order-delivery-options", orderDeliveryOptionsRouter);

export default router;
