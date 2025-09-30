import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { jest } from "@jest/globals";
import pool from "../../src/db.js";

const mockPoolQuery = jest.fn();
jest.unstable_mockModule("../../src/db.js", () => {
  return {
    default: {
      query: mockPoolQuery,
    },
  };
});

let server: Server;
let baseUrl: string;
let app: any;

describe("product user reviews", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/app.js");
    app = appModule.default;

    server = app.listen(0);
    baseUrl = `http://localhost:${
      (server.address() as AddressInfo).port
    }/api/v1`;
  });

  afterAll(() => {
    server.close();
  });

  describe("getUserReviewsHandler", () => {
    test("returns an array of user reviews for an existing product and returns 200", async () => {
      const mockReviews = [
        {
          id: 1,
          user_id: 101,
          product_id: 5,
          rating: 4,
          comment: "Great product! Really enjoyed using it.",
          created_at: "2023-08-01T12:00:00.000Z",
          updated_at: "2023-08-02T12:00:00.000Z",
          name: "Alice",
        },
        {
          id: 2,
          user_id: 102,
          product_id: 5,
          rating: 5,
          comment: "Exceeded expectations. Will buy again.",
          created_at: "2023-08-03T10:30:00.000Z",
          updated_at: "2023-08-03T11:00:00.000Z",
          name: "Bob",
        },
      ];
      mockPoolQuery.mockResolvedValueOnce({ rows: mockReviews });

      const response = await fetch(baseUrl + "/products/1/reviews");

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(mockReviews);
    });
  });
});
