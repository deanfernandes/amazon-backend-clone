import { Request, Response } from "express";
import pool from "../db.js";

export async function getOrderDeliveryOptionsHandler(
  req: Request,
  res: Response
) {
  try {
    const result = await pool.query(
      "SELECT * FROM user_order_delivery_options"
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
