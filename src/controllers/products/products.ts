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

//TODO: sorting, pagination (offset)
export async function getProductsHandler(req: Request, res: Response) {
  const { name, minPrice, maxPrice, category } = req.query;

  let query = `
    SELECT DISTINCT products.*
    FROM products
  `;

  const filters: string[] = [];
  const values: any[] = [];

  if (category) {
    query += `
      INNER JOIN product_product_categories ppc ON products.id = ppc.product_id
      INNER JOIN product_categories pc ON pc.id = ppc.product_category_id
    `;

    const categories = Array.isArray(category) ? category : [category];
    const placeholders = categories.map((_, i) => `$${values.length + i + 1}`);
    filters.push(`pc.name IN (${placeholders.join(", ")})`);
    values.push(...categories);
  }

  if (name) {
    filters.push(`products.name ILIKE $${values.length + 1}`);
    values.push(`%${name}%`);
  }

  if (minPrice) {
    filters.push(`products.price >= $${values.length + 1}`);
    values.push(Number(minPrice));
  }

  if (maxPrice) {
    filters.push(`products.price <= $${values.length + 1}`);
    values.push(Number(maxPrice));
  }

  if ("inStock" in req.query) {
    filters.push(`products.stock > 0`);
  }

  if (filters.length > 0) {
    query += " WHERE " + filters.join(" AND ");
  }

  try {
    const result = await pool.query<Product>(query, values);
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}
