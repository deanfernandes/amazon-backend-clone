import { Request, Response } from "express";
import pool from "../db.js";
import type { UserSubscriptionPlan } from "../models/userSubscriptionPlan.js";

export async function getUserSubscriptionPlansHandler(
  req: Request,
  res: Response
) {
  try {
    const result = await pool.query<UserSubscriptionPlan>(
      "SELECT * FROM user_subscription_plans"
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
