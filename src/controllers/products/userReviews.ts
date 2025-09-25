import type { Request, Response } from "express";
import pool from "../../db.js";

export async function getUserReviewsHandler(req: Request, res: Response) {
  const productId = req.params.productId;
  if (!productId) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query(
      "SELECT upr.*, u.name FROM user_product_reviews upr INNER JOIN users u ON upr.user_id = u.id WHERE upr.product_id = $1",
      [productId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
