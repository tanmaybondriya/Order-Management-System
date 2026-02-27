import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

const request = supertest(app);

describe("Health Check ", () => {
  it("should return 200 and healthy status", async () => {
    const res = await request.get("/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe("POST api/auth/register", () => {
  it("should return 200 with valid data", async () => {
    const res = await request.post("/api/auth/register").send({
      name: "John",
      email: `john_${Date.now()}@test.com`,
      password: "123456",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 with empty body", async () => {
    const res = await request.post("/api/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 with invalid email", async () => {
    const res = await request.post("/api/auth/register").send({
      name: "Test3",
      email: "test3",
      password: "123456",
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 with short password", async () => {
    const res = await request.post("/api/auth/register").send({
      name: "Test4",
      email: "test4@gmail.com",
      password: "123",
    });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 with duplicate email", async () => {
    const duplicateUser = {
      name: "Test5",
      email: "test5@gmail.com",
      password: "123456",
    };
    await request.post("/api/auth/register").send(duplicateUser);
    const res = await request.post("/api/auth/register").send(duplicateUser);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/auth/login", () => {
  beforeAll(async () => {
    await request.post("/api/auth/register").send({
      name: "Login Tester",
      email: "logintest@gmail.com",
      password: "123456",
    });
  });
  it("should return 200 with valid data", async () => {
    const res = await request.post("/api/auth/login").send({
      email: "logintest@gmail.com",
      password: "123456",
    });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined(); //token must exists
  });

  it("should return 401 with Wrong Password", async () => {
    const res = await request.post("/api/auth/login").send({
      email: "logintest@gmail.com",
      password: "wrongPassword",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 with Non-Existent email", async () => {
    const res = await request.post("/api/auth/login").send({
      email: "nobody@gmail.com",
      password: "123456",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 with missing fields", async () => {
    const res = await request.post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
