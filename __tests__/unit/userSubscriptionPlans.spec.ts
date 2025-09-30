import type { Server } from "node:http";
import { jest } from "@jest/globals";
import type { UserSubscriptionPlan } from "../../src/models/userSubscriptionPlan";
import pool from "../../src/db.js";
import type { AddressInfo } from "node:net";

const mockQuery = jest.fn();
jest.unstable_mockModule("../../src/db.js", () => {
  return {
    default: {
      query: mockQuery,
    },
  };
});

let server: Server;
let baseUrl: string;

let app: any;
describe("user subscription plans", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/app.js");
    app = appModule.default;

    server = app.listen(0);
    baseUrl = `http://localhost:${
      (server.address() as AddressInfo).port
    }/api/v1/subscription-plans`;
  });

  afterAll(() => {
    server.close();
  });

  test("getUserSubscriptionPlansHandler", async () => {
    const mockUserSubscriptionPlans: UserSubscriptionPlan[] = [
      { id: 1, name: "Monthly", price: 9.99, duration_days: 30 },
      { id: 2, name: "Annual", price: 99.99, duration_days: 365 },
    ];
    mockQuery.mockResolvedValueOnce({ rows: mockUserSubscriptionPlans });

    const response = await fetch(baseUrl);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockUserSubscriptionPlans);
  });
});
