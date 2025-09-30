import type { Server } from "node:http";
import app from "../../src/app";
import type { AddressInfo } from "node:net";
import { PostUserDto, PutUserDto } from "../../src/dtos/users";
import dotenv from "dotenv";
import pool from "../../src/db";

dotenv.config({ path: "./.env.test" });

let server: Server;
let baseUrl: string;

describe("users", () => {
  beforeAll(() => {
    server = app.listen(0);
    baseUrl = `http://localhost:${
      (server.address() as AddressInfo).port
    }/api/v1/users`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await pool.end();
  });

  beforeEach(async () => {
    await pool.query("DELETE FROM users");
  });

  describe("postUserHandler", () => {
    test("valid user returns 201", async () => {
      const mockUser: PostUserDto = {
        email: "test@example.com",
        password: "password",
        name: "tester",
      };

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockUser),
      });

      expect(response.status).toBe(201);
    });

    test("no user returns 400", async () => {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      expect(response.status).toBe(400);
    });

    test("invalid user with no name returns 400", async () => {
      const mockUser: any = {
        email: "test@example.com",
        password: "password",
      };

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockUser),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("getUsersHandler", () => {
    test("returns 200 and an array of users", async () => {
      const mockUsers = [
        {
          email: "alice@example.com",
          password_hash: "hash1",
          name: "Alice",
        },
        {
          email: "bob@example.com",
          password_hash: "hash2",
          name: "Bob",
        },
      ];

      const insertedUsers = [];
      for (const user of mockUsers) {
        const result = await pool.query(
          `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, is_email_verified`,
          [user.email, user.password_hash, user.name]
        );
        insertedUsers.push(result.rows[0]);
      }

      const response = await fetch(baseUrl);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toEqual(insertedUsers);
    });

    test("valid limit query returns 200 and correct number of users", async () => {
      const mockUsers = [
        {
          email: "alice@example.com",
          password_hash: "hash1",
          name: "Alice",
        },
        {
          email: "bob@example.com",
          password_hash: "hash2",
          name: "Bob",
        },
      ];

      const insertedUsers = [];
      for (const user of mockUsers) {
        const result = await pool.query(
          `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, is_email_verified`,
          [user.email, user.password_hash, user.name]
        );
        insertedUsers.push(result.rows[0]);
      }

      const response = await fetch(baseUrl + "?limit=1");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users.length).toBe(1);
      expect(data.users).toEqual(insertedUsers.splice(0, 1));
    });

    test("valid page and limit query returns 200 and correct users", async () => {
      const mockUsers = [
        {
          email: "alice@example.com",
          password_hash: "hash1",
          name: "Alice",
        },
        {
          email: "bob@example.com",
          password_hash: "hash2",
          name: "Bob",
        },
      ];

      const insertedUsers = [];
      for (const user of mockUsers) {
        const result = await pool.query(
          `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, is_email_verified`,
          [user.email, user.password_hash, user.name]
        );
        insertedUsers.push(result.rows[0]);
      }

      const response = await fetch(baseUrl + "?page=2&limit=1");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.users).toEqual(insertedUsers.splice(1, 1));
    });

    test("invalid page returns 400", async () => {
      const response = await fetch(baseUrl + "?page=-5", {
        method: "GET",
      });

      expect(response.status).toBe(400);
    });

    test("invalid limit returns 400", async () => {
      const response = await fetch(baseUrl + "?limit=-5", {
        method: "GET",
      });

      expect(response.status).toBe(400);
    });

    test("invalid page and limit returns 400", async () => {
      const response = await fetch(baseUrl + "?page=-5&limit=-5", {
        method: "GET",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("putUserHandler", () => {
    test("update user password returns 204", async () => {
      const insertResult = await pool.query(
        `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id`,
        ["test@example.com", "oldHash", "tester"]
      );
      const userId = insertResult.rows[0].id;

      const mockUser: PutUserDto = {
        email: "test@example.com",
        password: "newPassword",
        name: "tester",
      };

      const response = await fetch(baseUrl + `/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUser),
      });

      expect(response.status).toBe(204);
    });

    test("update user doesn't exist returns 404", async () => {
      const mockUser: PutUserDto = {
        email: "test@example.com",
        password: "newPassword",
        name: "tester",
      };

      const response = await fetch(baseUrl + `/9999`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUser),
      });

      expect(response.status).toBe(404);
    });
  });

  describe("deleteUserHandler", () => {
    test("delete exising user returns 204", async () => {
      const insertResult = await pool.query(
        `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id`,
        ["test@example.com", "oldHash", "tester"]
      );
      const userId = insertResult.rows[0].id;

      const response = await fetch(baseUrl + `/${userId}`, {
        method: "DELETE",
      });

      expect(response.status).toBe(204);
    });

    test("delete user that doesn't exist returns 404", async () => {
      const response = await fetch(baseUrl + `/999999`, {
        method: "DELETE",
      });

      expect(response.status).toBe(404);
    });
  });
});
