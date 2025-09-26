import type { Request, Response } from "express";
import pool from "../db.js";
import type { ProductCategory } from "../models/productCategory.js";

export async function getProductCategoriesHandler(req: Request, res: Response) {
  try {
    const result = await pool.query<ProductCategory>(
      "SELECT id, name FROM product_categories"
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
