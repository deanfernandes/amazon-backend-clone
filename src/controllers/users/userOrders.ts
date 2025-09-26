import { Request, Response } from "express";
import pool from "../../db.js";
import type { PostUserOrderDto } from "../../dtos/userOrder.js";

//TODO: snapshot delivery price
export async function postUserOrderHandler(req: Request, res: Response) {
  const userId = Number(req.params.userId);
  if (!userId || isNaN(userId)) {
    return res.status(400).send();
  }

  const userOrder: PostUserOrderDto = req.body;
  if (
    !userOrder ||
    typeof userOrder.user_order_delivery_option_id !== "number" ||
    userOrder.items.length === 0
  ) {
    return res.status(400).send();
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query<{ id: number }>(
      "INSERT INTO user_orders (user_id, user_order_delivery_option_id) VALUES ($1, $2) RETURNING id",
      [userId, userOrder.user_order_delivery_option_id]
    );

    for (let i: number = 0; i < userOrder.items.length; i++) {
      const resultProductStockPrice = await client.query<{
        stock: number;
        price: number;
      }>("SELECT price, stock from products WHERE id = $1", [
        userOrder.items[i].product_id,
      ]);
      if (resultProductStockPrice.rowCount === 0) {
        await client.query("ROLLBACK");

        return res.status(404).send();
      }
      if (resultProductStockPrice.rows[0].stock < userOrder.items[i].quantity) {
        await client.query("ROLLBACK");

        return res.status(400).send();
      }

      await client.query(
        "INSERT INTO user_order_products (user_order_id, product_id, product_price, quantity) VALUES ($1, $2, $3, $4)",
        [
          result.rows[0].id,
          userOrder.items[i].product_id,
          resultProductStockPrice.rows[0].price,
          userOrder.items[i].quantity,
        ]
      );

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [userOrder.items[i].quantity, userOrder.items[i].product_id]
      );
    }

    await client.query("COMMIT");

    return res.status(201).send();
  } catch (err) {
    await client.query("ROLLBACK");

    console.error(err);

    return res.status(500).send();
  } finally {
    client.release();
  }
}

export async function getUserOrdersHandler(req: Request, res: Response) {
  const userId = Number(req.params.userId);
  if (!userId || isNaN(userId)) {
    return res.status(400).send();
  }

  try {
    const ordersResult = await pool.query(
      `
      SELECT
        uo.id AS order_id,
        uo.created_at,
        uodo.name AS delivery_option_name,
        uodo.price AS delivery_price,
        uos.name AS order_status
      FROM user_orders uo
      INNER JOIN user_order_delivery_options uodo
        ON uo.user_order_delivery_option_id = uodo.id
      INNER JOIN user_order_statuses uos
        ON uo.user_order_status_id = uos.id
      WHERE uo.user_id = $1
      ORDER BY uo.created_at DESC
      `,
      [userId]
    );

    const orders = ordersResult.rows;

    if (orders.length === 0) {
      return res.status(200).json([]);
    }

    const orderIds = orders.map((order) => order.order_id);

    const productsResult = await pool.query(
      `
      SELECT
        uop.user_order_id AS order_id,
        p.id AS product_id,
        p.name,
        p.image_url,
        uop.product_price,
        uop.quantity
      FROM user_order_products uop
      INNER JOIN products p ON uop.product_id = p.id
      WHERE uop.user_order_id = ANY($1::bigint[])
      `,
      [orderIds]
    );

    const products = productsResult.rows;

    const orderProductsMap: Record<number, any[]> = {};
    for (const product of products) {
      const orderId = product.order_id;
      if (!orderProductsMap[orderId]) {
        orderProductsMap[orderId] = [];
      }
      orderProductsMap[orderId].push({
        product_id: product.product_id,
        name: product.name,
        image_url: product.image_url,
        product_price: product.product_price,
        quantity: product.quantity,
      });
    }

    const response = orders.map((order) => ({
      ...order,
      products: orderProductsMap[order.order_id] || [],
    }));

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function getUserOrderByIdHandler(req: Request, res: Response) {
  const userId = Number(req.params.userId);
  const id = Number(req.params.id);

  if (!userId || isNaN(userId) || !id || isNaN(id)) {
    return res.status(400).send();
  }

  try {
    const orderResult = await pool.query(
      `
      SELECT
        uo.id AS order_id,
        uo.created_at,
        uodo.name AS delivery_option_name,
        uodo.price AS delivery_price,
        uos.name AS order_status
      FROM user_orders uo
      INNER JOIN user_order_delivery_options uodo
        ON uo.user_order_delivery_option_id = uodo.id
      INNER JOIN user_order_statuses uos
        ON uo.user_order_status_id = uos.id
      WHERE uo.id = $1 AND uo.user_id = $2
      `,
      [id, userId]
    );

    if (orderResult.rowCount === 0) {
      return res.status(404).send();
    }

    const order = orderResult.rows[0];

    const productsResult = await pool.query(
      `
      SELECT
        p.id AS product_id,
        p.name,
        p.image_url,
        uop.product_price,
        uop.quantity
      FROM user_order_products uop
      INNER JOIN products p ON uop.product_id = p.id
      WHERE uop.user_order_id = $1
      `,
      [id]
    );

    const products = productsResult.rows;

    return res.status(200).json({
      ...order,
      products,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
