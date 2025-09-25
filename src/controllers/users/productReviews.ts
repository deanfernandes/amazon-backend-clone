import { Request, Response } from "express";
import pool from "../../db.js";
import type { UserProductReviewDto } from "../../dtos/userProductReview.js";

export async function getProductReviewsHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  try {
    let result = await pool.query(
      "SELECT upr.*, p.name, p.image_url FROM user_product_reviews upr INNER JOIN products p ON upr.product_id = p.id WHERE upr.user_id = $1",
      [userId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function putProductReviewHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }

  const userProductReview: UserProductReviewDto = req.body;
  if (
    !userProductReview ||
    typeof userProductReview.content !== "string" ||
    userProductReview.content.trim() === "" ||
    typeof userProductReview.rating !== "number" ||
    userProductReview.rating < 0 ||
    userProductReview.rating > 5
  ) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query(
      "SELECT * FROM user_product_reviews WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    //TODO: add updated_at migration
    await pool.query(
      "UPDATE user_product_reviews SET content = $1, rating = $2, created_at = NOW() WHERE id = $3 AND user_id = $4",
      [userProductReview.content, userProductReview.rating, id, userId]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function deleteProductReviewHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query(
      "SELECT * FROM user_product_reviews WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    await pool.query(
      "DELETE FROM user_product_reviews WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
