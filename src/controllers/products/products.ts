import type { Request, Response } from "express";
import pool from "../../db.js";
import type { PostProductDto } from "../../dtos/products.js";
import type { Product } from "../../models/product.js";

export async function postProductHandler(req: Request, res: Response) {
  const product: PostProductDto = req.body;

  if (
    !product ||
    typeof product.name !== "string" ||
    typeof product.description !== "string" ||
    typeof product.image_url !== "string" ||
    typeof product.price !== "number" ||
    typeof product.stock !== "number" ||
    product.stock < 0 ||
    !product.product_category_ids
  ) {
    return res.status(400).send();
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      "INSERT INTO products (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [
        product.name,
        product.description,
        product.price,
        product.stock,
        product.image_url,
      ]
    );
    //TODO: single query
    for (let i: number = 0; i < product.product_category_ids.length; i++) {
      await client.query(
        "INSERT INTO product_product_categories (product_id, product_category_id) VALUES ($1, $2)",
        [result.rows[0].id, product.product_category_ids[i]]
      );
    }
    await client.query("COMMIT");

    return res.status(204).send();
  } catch (err) {
    await client.query("ROLLBACK");

    console.error(err);

    return res.status(500).send();
  } finally {
    client.release();
  }
}

//TODO: filters (query, name/min price/max price/categories/not out of stock), sorting, pagination (offset)
export async function getProductsHandler(req: Request, res: Response) {
  try {
    const result = await pool.query<Product>("SELECT * FROM products");

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
