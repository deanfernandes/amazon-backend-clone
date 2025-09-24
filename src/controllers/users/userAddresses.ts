import { Request, Response } from "express";
import type {
  PostUserAddressDto,
  PutUserAddressDto,
} from "../../dtos/userAddress.js";
import type { UserAddress } from "../../models/userAddress.js";
import pool from "../../db.js";

export async function postUserAddressHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const address: PostUserAddressDto = req.body;

  if (!address || !address.address_line_1 || !address.postcode) {
    return res.status(400).send();
  }

  try {
    const address_line_2 = address.address_line_2 || null;
    await pool.query(
      "INSERT INTO user_addresses (address_line_1, address_line_2, postcode, user_id) VALUES ($1, $2, $3, $4)",
      [address.address_line_1, address_line_2, address.postcode, userId]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function getUserAddressesHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query<UserAddress>(
      "SELECT * FROM user_addresses WHERE user_id = $1",
      [userId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function getUserAddressHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }

  try {
    const result = await pool.query<UserAddress>(
      "SELECT * FROM user_addresses WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}

export async function putUserAddressHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }

  const userAddress: PutUserAddressDto = req.body;

  if (!userAddress || !userAddress.address_line_1 || !userAddress.postcode) {
    return res.status(400).send();
  }

  try {
    const address_line_2 = userAddress.address_line_2 || null;
    await pool.query<UserAddress>(
      "UPDATE user_addresses SET address_line_1=$1, address_line_2=$2, postcode=$3 WHERE id=$4 AND user_id=$5",
      [
        userAddress.address_line_1,
        address_line_2,
        userAddress.postcode,
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

export async function deleteUserAddressHandler(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).send();
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).send();
  }

  try {
    await pool.query<UserAddress>(
      "DELETE FROM user_addresses WHERE id=$1 AND user_id=$2",
      [id, userId]
    );

    return res.status(204).send();
  } catch (err) {
    console.error(err);

    return res.status(500).send();
  }
}
