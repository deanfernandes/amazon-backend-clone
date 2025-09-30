import type { Server } from "node:http";
import app from "../../src/app";
import type { AddressInfo } from "node:net";
import { PostUserDto, PutUserDto } from "../../src/dtos/users";
import dotenv from "dotenv";
import pool from "../../src/db";

dotenv.config({ path: "./.env.test" });

let server: Server;
let baseUrl: string;

describe("user subscription plans", () => {
  beforeAll(() => {
    server = app.listen(0);
    baseUrl = `http://localhost:${
      (server.address() as AddressInfo).port
    }/api/v1/subscription-plans`;
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

  describe("getUserSubscriptionPlansHandler", () => {
    test("returns 200 and array of plans", async () => {
      const response = await fetch(baseUrl);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: "Monthly",
            price: expect.any(String),
            duration_days: 30,
          }),
          expect.objectContaining({
            id: expect.any(String),
            name: "Annual",
            price: expect.any(String),
            duration_days: 365,
          }),
        ])
      );
    });
  });
});
