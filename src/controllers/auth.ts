import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../db.js";
import jwt, { SignOptions } from "jsonwebtoken";

export async function registerHandler(req: Request, res: Response) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (result.rowCount > 0) {
      return res.status(400).send();
    }

    const password_hash = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
      [email, password_hash, name]
    );

    //TODO: send verification email

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).send();
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
