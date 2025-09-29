import type { Server } from "node:http";
import { jest } from "@jest/globals";
import type { UserSubscriptionPlan } from "../../src/models/userSubscriptionPlan";
import pool from "../../src/db.js";

const mockQuery = jest.fn();
jest.unstable_mockModule("../../src/db.js", () => {
  return {
    default: {
      query: mockQuery,
    },
  };
});

let server: Server;
const PORT = 3001;
const baseUrl = `http://localhost:${PORT}/api/v1/subscription-plans`;

let app: any;
describe("user subscription plans", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/app.js");
    app = appModule.default;

    server = app.listen(PORT, () => {
      console.log(`app listening http://localhost:${PORT}`);
    });
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
