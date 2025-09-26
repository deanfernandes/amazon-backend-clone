import { Request, Response } from "express";
import pool from "../../db.js";
import { PostUserSubscriptionDto } from "../../dtos/userSubscriptions.js";

export async function postUserSubscriptionHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const userSubscription: PostUserSubscriptionDto = req.body;

  if (!userSubscription || !userSubscription.user_subscription_plan_id) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query(
      "SELECT duration_days FROM user_subscription_plans WHERE id = $1",
      [userSubscription.user_subscription_plan_id]
    );
    if (result.rowCount === 0) {
      return res.status(400).send();
    }

    await pool.query(
      "INSERT INTO user_subscriptions (end_date, user_id, user_subscription_plan_id) VALUES (NOW() + ($1 || ' days')::INTERVAL, $2, $3)",
      [
        result.rows[0].duration_days,
        userId,
        userSubscription.user_subscription_plan_id,
      ]
    );

    return res.status(201).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function getUserSubscriptionsHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query(
      `
      SELECT us.id, us.start_date, us.end_date, uss.name AS status_name, usp.name AS plan_name, usp.price, usp.duration_days
      FROM user_subscriptions us
      JOIN user_subscription_statuses uss ON uss.id = us.user_subscription_status_id
      JOIN user_subscription_plans usp ON usp.id = us.user_subscription_plan_id
      WHERE us.user_id = $1
      `,
      [userId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function deleteUserSubscriptionHandler(
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
    const result = await pool.query(
      "DELETE FROM user_subscriptions WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
