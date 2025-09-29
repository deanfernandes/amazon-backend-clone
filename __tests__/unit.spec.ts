import type { PostUserDto } from "../src/dtos/users.js";
import type { Server } from "node:http";
import { jest } from "@jest/globals";

const PORT = 3000;
let server: Server;

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn(() => Promise.resolve("mocked-hash")),
  },
}));

const mockQuery = jest.fn();
const mockRelease = jest.fn();
const mockConnect = jest.fn(() =>
  Promise.resolve({
    query: mockQuery,
    release: mockRelease,
  })
);

jest.unstable_mockModule("../src/db.js", () => ({
  default: {
    connect: mockConnect,
  },
}));

let app: any;
let bcrypt: any;
let pool: any;

beforeAll(async () => {
  bcrypt = (await import("bcrypt")).default;
  pool = (await import("../src/db.js")).default;
  app = (await import("../src/app.js")).default;

  server = app.listen(PORT, () => {
    console.log(`app listening http://localhost:${PORT}`);
  });
});

afterAll(() => {
  server.close();
});

test("POST /api/v1/users returns 201", async () => {
  mockQuery
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({ rows: [{ id: 1 }] })
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({});

  const mockUser: PostUserDto = {
    email: "test@example.com",
    password: "password",
    name: "tester",
  };

  const response = await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mockUser),
  });

  expect(response.status).toBe(201);
});
