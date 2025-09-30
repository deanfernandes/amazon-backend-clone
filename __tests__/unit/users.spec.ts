import type { PostUserDto, PutUserDto } from "../../src/dtos/users.js";
import type { Server } from "node:http";
import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import pool from "../../src/db.js";
import type { AddressInfo } from "node:net";

jest.unstable_mockModule("bcrypt", () => {
  return {
    default: {
      hash: jest.fn().mockResolvedValue("mockPasswordHash"),
    },
  };
});

const mockQuery = jest.fn();
const mockPoolQuery = jest.fn();
jest.unstable_mockModule("../../src/db.js", () => {
  return {
    default: {
      connect: jest.fn().mockResolvedValue({
        query: mockQuery,
        release: jest.fn(),
      }),
      query: mockPoolQuery,
    },
  };
});

let server: Server;
let baseUrl: string;
let app: any;

beforeAll(async () => {
  const appModule = await import("../../src/app.js");
  app = appModule.default;

  server = app.listen(0);
  baseUrl = `http://localhost:${
    (server.address() as AddressInfo).port
  }/api/v1/users`;
});

afterAll(() => {
  server.close();
});

describe("/api/v1/users", () => {
  describe("POST", () => {
    test("valid user returns 201", async () => {
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

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUser),
      });

      expect(response.status).toBe(201);
    });

    test("no user returns 400", async () => {
      mockQuery
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      expect(response.status).toBe(400);
    });

    test("invalid user with no name returns 400", async () => {
      const mockUser: PostUserDto = {
        email: "test@example.com",
        password: "password",
      };

      mockQuery
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({});

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUser),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("GET", () => {
    test("returns 200 and an array of users", async () => {
      const mockUsers = [
        {
          id: 1,
          email: "bob@gmail.com",
          password: "password",
          name: "bob",
          is_email_verified: true,
        },
        {
          id: 2,
          email: "alice@gmail.com",
          password: "password",
          name: "alice",
          is_email_verified: false,
        },
      ];
      mockPoolQuery.mockResolvedValueOnce({ rows: mockUsers });
      mockPoolQuery.mockResolvedValueOnce({ rows: [{ count: 1000 }] });

      const response = await fetch(baseUrl, {
        method: "GET",
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.users).toEqual(mockUsers);
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

  describe("PUT, putUserHandler", () => {
    test("valid user returns 204", async () => {
      const mockUser: PutUserDto = {
        email: "test@example.com",
        password: "newPassword",
        name: "tester",
      };
      mockPoolQuery.mockResolvedValueOnce({ rowCount: 1 });

      const response = await fetch(baseUrl + "/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUser),
      });

      expect(response.status).toBe(204);
    });

    test("user doesn't exist returns 404", async () => {
      const mockUser: PutUserDto = {
        email: "test@example.com",
        password: "newPassword",
        name: "tester",
      };
      mockPoolQuery.mockResolvedValueOnce({ rowCount: 0 });

      const response = await fetch(baseUrl + "/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUser),
      });

      expect(response.status).toBe(404);
    });

    test("send request without user returns 400", async () => {
      const response = await fetch(baseUrl + "/1", {
        method: "PUT",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE , deleteUserHandler", () => {
    test("delete existing user returns 204", async () => {
      mockPoolQuery.mockResolvedValueOnce({ rowCount: 1 });

      const response = await fetch(baseUrl + "/1", {
        method: "DELETE",
      });

      expect(response.status).toBe(204);
    });

    test("delete a user that doesn't exist returns 404", async () => {
      mockPoolQuery.mockResolvedValueOnce({ rowCount: 0 });

      const response = await fetch(baseUrl + "/9999", {
        method: "DELETE",
      });

      expect(response.status).toBe(404);
    });
  });
});
