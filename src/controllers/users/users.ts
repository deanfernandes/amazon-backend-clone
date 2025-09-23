import type { Request, Response } from "express";
import pool from "../../db.js";
import type { PostUserDto, GetUserDto, PutUserDto } from "../../dtos/user.js";
import bcrypt from "bcrypt";

export async function postUserHandler(req: Request, res: Response) {
  const user: PostUserDto = req.body;

  if (!user || !user.email || !user.password || !user.name) {
    return res.status(400).send();
  }

  try {
    const password_hash = await bcrypt.hash(user.password, 10);

    await pool.query(
      "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
      [user.email, password_hash, user.name]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function getUsersHandler(req: Request, res: Response) {
  try {
    const result = await pool.query<GetUserDto>(
      "SELECT id, email, name, is_email_verified FROM users",
      []
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function getUserHandler(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query<GetUserDto>(
      "SELECT id, email, name, is_email_verified FROM users WHERE id=$1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function putUserHandler(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send();
  }

  const user: PutUserDto = req.body;

  if (!user || !user.email || !user.password || !user.name) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query<GetUserDto>(
      "SELECT id FROM users WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    const password_hash = await bcrypt.hash(user.password, 10);

    await pool.query(
      "UPDATE users SET email = $1, password_hash = $2, name = $3 WHERE id = $4",
      [user.email, password_hash, user.name, id]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteUserHandler(req: Request, res: Response) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send();
  }

  try {
    let result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).send();
    }

    await pool.query("DELETE FROM users WHERE id=$1", [id]);

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
