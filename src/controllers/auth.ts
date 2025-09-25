import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";
import jwt, { SignOptions } from "jsonwebtoken";
import type {
  EmailVerificationPayload,
  ResetPasswordPayload,
} from "../types/jwtPayloads.js";
import type { User } from "../models/user.js";

export async function registerHandler(req: Request, res: Response) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).send();
  }

  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rowCount > 0) {
      return res.status(400).send();
    }

    const password_hash = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    const resultUserId = await client.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
      [email, password_hash, name]
    );

    await client.query("INSERT INTO user_wishlist (user_id) VALUES ($1)", [
      resultUserId.rows[0].id,
    ]);

    await client.query("COMMIT");

    const payload: EmailVerificationPayload = { email };
    const token = jwt.sign(
      payload,
      process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET!,
      {
        expiresIn: process.env.JWT_EMAIL_VERIFICATION_EXPIRY!,
      } as SignOptions
    );

    //TODO: send verification email and token

    return res.status(204).send();
  } catch (err) {
    await client.query("ROLLBACK");

    console.error(err);

    return res.status(500).send();
  } finally {
    client.release();
  }
}

export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send();
  }

  try {
    let result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    if (
      (await bcrypt.compare(password, result.rows[0].password_hash)) === false
    ) {
      return res.status(401).send();
    }

    if (result.rows[0].is_email_verified === false) {
      return res.status(403).send();
    }

    const accessToken = jwt.sign({}, process.env.JWT_ACCESS_TOKEN_SECRET!, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY!,
    } as SignOptions);
    const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_TOKEN_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY!,
    } as SignOptions);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

export async function logoutHandler(req: Request, res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
  });

  return res.status(200).send();
}

export async function verifyEmailHandler(req: Request, res: Response) {
  const token = req.query.token;

  if (!token || typeof token !== "string") {
    return res.status(400).send();
  }

  try {
    const payload: EmailVerificationPayload = jwt.verify(
      token as string,
      process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET!
    ) as EmailVerificationPayload;

    const result = await pool.query<User>(
      "SELECT is_email_verified FROM users WHERE email=$1",
      [payload.email]
    );

    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    const user = result.rows[0];
    if (user.is_email_verified) {
      return res.status(400).send();
    }

    await pool.query(
      "UPDATE users SET is_email_verified = true WHERE email = $1",
      [payload.email]
    );

    return res.status(200).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    const payload: ResetPasswordPayload = { email };
    const token = jwt.sign(
      payload,
      process.env.JWT_RESET_PASSWORD_TOKEN_SECRET!,
      {
        expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRY!,
      } as SignOptions
    );

    //TODO: send reset pw email + token

    return res.status(200).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).send();
  }

  try {
    const payload: ResetPasswordPayload = jwt.verify(
      token as string,
      process.env.JWT_RESET_PASSWORD_TOKEN_SECRET!
    ) as ResetPasswordPayload;

    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email=$1",
      [payload.email]
    );

    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    const password_hash = await bcrypt.hash(password, 10);

    await pool.query("UPDATE users SET password_hash=$1 WHERE email=$2", [
      password_hash,
      payload.email,
    ]);

    return res.status(200).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function resendVerificationEmailHandler(
  req: Request,
  res: Response
) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).send(); //TODO: 200?
    }

    const user = result.rows[0];

    if (user.is_email_verified) {
      return res.status(400).send();
    }

    const payload: EmailVerificationPayload = { email };
    const token = jwt.sign(
      payload,
      process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET!,
      {
        expiresIn: process.env.JWT_EMAIL_VERIFICATION_EXPIRY!,
      } as SignOptions
    );

    // TODO: send verification email with the token/link

    return res.status(200).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send();
  }
}
