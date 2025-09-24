import { Request, Response } from "express";
import {
  PostUserPaymentMethodDto,
  GetUserPaymentMethodDto,
  PutUserPaymentMethodDto,
} from "../../dtos/userPaymentMethods.js";
import {
  UserPaymentMethodType,
  UserPaymentMethod,
} from "../../models/userPaymentMethod.js";
import pool from "../../db.js";

export async function postUserPaymentMethodHandler(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const payment_method: PostUserPaymentMethodDto = req.body;

  if (!payment_method || !payment_method.type) {
    return res.status(400).send();
  }

  try {
    if (payment_method.type === UserPaymentMethodType.CreditCard) {
      if (
        !payment_method.card_number ||
        !payment_method.cardholder_name ||
        !payment_method.expiry_month ||
        !payment_method.expiry_year ||
        !payment_method.security_code
      ) {
        return res.status(400).send();
      }
      await pool.query(
        "INSERT INTO user_payment_methods (type, card_number, cardholder_name, security_code, expiry_month, expiry_year, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          "credit_card",
          payment_method.card_number,
          payment_method.cardholder_name,
          payment_method.security_code,
          payment_method.expiry_month,
          payment_method.expiry_year,
          userId,
        ]
      );
    } else if (payment_method.type === UserPaymentMethodType.Paypal) {
      if (!payment_method.paypal_email) {
        return res.status(400).send();
      }

      await pool.query(
        "INSERT INTO user_payment_methods (type, paypal_email, user_id) VALUES ($1, $2, $3)",
        ["paypal", payment_method.paypal_email, userId]
      );
    } else {
      return res.status(400).send();
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function getUserPaymentMethodsHandler(
  req: Request,
  res: Response
) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query<UserPaymentMethod>(
      "SELECT * FROM user_payment_methods WHERE user_id = $1",
      [userId]
    );

    const paymentMethods: GetUserPaymentMethodDto[] = result.rows.map((pm) => ({
      id: pm.id,
      type: pm.type,
      user_id: pm.user_id,
      card_number: pm.card_number ?? undefined,
      cardholder_name: pm.cardholder_name ?? undefined,
      expiry_month: pm.expiry_month ?? undefined,
      expiry_year: pm.expiry_year ?? undefined,
      paypal_email: pm.paypal_email ?? undefined,
    }));

    return res.status(200).json(paymentMethods);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function getUserPaymentMethodHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query<UserPaymentMethod>(
      "SELECT * FROM user_payment_methods WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    const paymentMethod: GetUserPaymentMethodDto = {
      id: result.rows[0].id,
      type: result.rows[0].type,
      user_id: result.rows[0].user_id,
      card_number: result.rows[0].card_number ?? undefined,
      cardholder_name: result.rows[0].cardholder_name ?? undefined,
      expiry_month: result.rows[0].expiry_month ?? undefined,
      expiry_year: result.rows[0].expiry_year ?? undefined,
      paypal_email: result.rows[0].paypal_email ?? undefined,
    };

    return res.status(200).json(paymentMethod);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function putUserPaymentMethodHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }

  const userPaymentMethod: PutUserPaymentMethodDto = req.body;

  if (!userPaymentMethod || !userPaymentMethod.type) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query<UserPaymentMethod>(
      "SELECT * FROM user_payment_methods WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    await pool.query(
      "UPDATE user_payment_methods SET type=$1, card_number=$2, cardholder_name=$3, security_code=$4, expiry_month=$5, expiry_year=$6, paypal_email=$7 WHERE id=$8 AND user_id=$9",
      [
        userPaymentMethod.type,
        userPaymentMethod.card_number || null,
        userPaymentMethod.cardholder_name || null,
        userPaymentMethod.security_code || null,
        userPaymentMethod.expiry_month || null,
        userPaymentMethod.expiry_year || null,
        userPaymentMethod.paypal_email || null,
        id,
        userId,
      ]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function deleteUserPaymentMethodHandler(
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
    await pool.query(
      "DELETE FROM user_payment_methods WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
