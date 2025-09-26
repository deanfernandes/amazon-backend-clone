import { Request, Response } from "express";
import pool from "../../db.js";
import { PostUserWishlistDto } from "../../dtos/userWishlist.js";
import type { Product } from "../../models/product.js";

export async function postUserWishlistHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const userWishlist: PostUserWishlistDto = req.body;

  if (!userWishlist || typeof userWishlist.product_id !== "number") {
    return res.status(400).send();
  }

  try {
    let result = await pool.query("SELECT * FROM products WHERE id = $1", [
      userWishlist.product_id,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    result = await pool.query(
      "SELECT id FROM user_wishlists WHERE user_id = $1",
      [userId]
    );

    await pool.query(
      "INSERT INTO user_wishlist_products (user_wishlist_id, product_id) VALUES ($1, $2)",
      [result.rows[0].id, userWishlist.product_id]
    );

    return res.status(201).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function getUserWishlistProductsHandler(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  try {
    const resultUserWishlistId = await pool.query<{ id: number }>(
      "SELECT id FROM user_wishlists WHERE user_id = $1",
      [userId]
    );

    const resultUserWishlistProducts = await pool.query<Product>(
      "SELECT p.* FROM user_wishlist_products uwp INNER JOIN products p ON uwp.product_id = p.id WHERE uwp.user_wishlist_id = $1",
      [resultUserWishlistId.rows[0].id]
    );

    return res.status(200).json(resultUserWishlistProducts.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function deleteUserWishlistProductHandler(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }

  try {
    const resultUserWishlistId = await pool.query<{ id: number }>(
      "SELECT id FROM user_wishlists WHERE user_id = $1",
      [userId]
    );

    const result = await pool.query(
      "SELECT * FROM user_wishlist_products WHERE user_wishlist_id = $1 AND product_id = $2",
      [resultUserWishlistId.rows[0].id, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    await pool.query(
      "DELETE FROM user_wishlist_products WHERE user_wishlist_id = $1 AND product_id = $2",
      [resultUserWishlistId.rows[0].id, id]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
