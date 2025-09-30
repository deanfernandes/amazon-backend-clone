import type { Server } from "node:http";
import { jest } from "@jest/globals";
import pool from "../../src/db.js";
import type { PostProductDto, PutProductDto } from "../../src/dtos/products.js";
import type { Product } from "../../src/models/product.js";

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
describe("products", () => {
  beforeAll(async () => {
    const appModule = await import("../../src/app.js");
    app = appModule.default;

    server = app.listen(0);
    baseUrl = `http://localhost:${server.address().port}/api/v1/products`;
  });

  afterAll(() => {
    server.close();
  });

  describe("postProductHandler", () => {
    test("post a valid product returns 201", async () => {
      const mockProduct: PostProductDto = {
        name: "test",
        description: "testing123",
        price: 1.99,
        stock: 100,
        image_url: "www",
        product_category_ids: [],
        product_option_ids: [],
      };
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockProduct),
      });

      expect(response.status).toBe(201);
    });

    test("post am invalid product returns 400", async () => {
      const mockProduct = {
        name: "test",
        description: "testing123",
        price: 1.99,
        stock: 100,
      };

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockProduct),
      });

      expect(response.status).toBe(400);
    });

    test("post a valid product with negative stock returns 400", async () => {
      const mockProduct: PostProductDto = {
        name: "test",
        description: "testing123",
        price: 1.99,
        stock: -5,
        image_url: "www",
        product_category_ids: [],
        product_option_ids: [],
      };

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockProduct),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("getProductsHandler", () => {
    test("get products with no filters/sorts returns array of products and 200 status code", async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "test product",
          description: "testing123",
          price: 1.99,
          stock: 1,
          image_url: "www",
          created_at: "2025-09-29T14:30:45.123Z",
        },
        {
          id: 2,
          name: "test product",
          description: "testing123",
          price: 1.99,
          stock: 1,
          image_url: "www",
          created_at: "2025-09-29T14:30:45.123Z",
        },
        {
          id: 3,
          name: "test product",
          description: "testing123",
          price: 1.99,
          stock: 1,
          image_url: "www",
          created_at: "2025-09-29T14:30:45.123Z",
        },
      ];
      mockPoolQuery.mockResolvedValueOnce({ rows: mockProducts });

      const response = await fetch(baseUrl);

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.length).toBe(3);
      expect(data).toEqual(mockProducts);
    });
  });

  describe("putProductHandler", () => {
    test("send put request with valid product returns 204", async () => {
      const mockProduct: PutProductDto = {
        name: "test product",
        description: "testing123",
        price: 1.99,
        stock: 1,
        image_url: "www",
        product_category_ids: [],
      };
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const response = await fetch(baseUrl + "/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockProduct),
      });

      expect(response.status).toBe(204);
    });
  });

  describe("deleteProductHandler", () => {
    test("send delete request returns 204", async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const response = await fetch(baseUrl + "/1", {
        method: "DELETE",
      });

      expect(response.status).toBe(204);
    });
  });
});
