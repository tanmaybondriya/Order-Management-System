import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import supertest from "supertest";
import app from "../app.js";
import { authHeader, registerAndLogin } from "./helpers/auth.helper.js";

const request = supertest(app);

describe("POST /api/payments/create-order", () => {
  let token;
  let orderId;

  beforeAll(async () => {
    const result = await registerAndLogin({ role: "admin" });
    token = result.token;
  });
  beforeEach(async () => {
    const product = await request
      .post("/api/products")
      .set(authHeader(token))
      .send({ name: "Test Product", price: 1000, stock: 10 });
    const order = await request
      .post("/api/orders/create-order")
      .set(authHeader(token))
      .send({ productId: product.body.data._id, quantity: 1 });
    orderId = order.body.data._id;
  });
  it("should create payment order with valid orderId", async () => {
    const res = await request
      .post("/api/payments/create-order")
      .set(authHeader(token))
      .send({
        orderId: orderId,
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.gatewayOrderId).toBeDefined();
    expect(res.body.data.amount).toBe(1000);
  });
  it("should return 401 without token", async () => {
    const res = await request
      .post("/api/payments/create-order")
      .send({ orderId: orderId });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
  it("should return 401 with invalid orderId", async () => {
    const res = await request.post("/api/payments/create-order").send({
      orderId: "000000000000000000000000",
    });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
  it("should return 400 if order already paid", async () => {
    const paymentRes = await request
      .post("/api/payments/create-order")
      .set(authHeader(token))
      .send({ orderId });
    console.log(paymentRes._body);
    const gatewayOrderId = paymentRes.body.data.gatewayOrderId;

    await request
      .post("/api/payments/verify")
      .set(authHeader(token))
      .send({ orderId, transactionId: gatewayOrderId });
    const res = await request
      .post("/api/payments/create-order")
      .set(authHeader(token))
      .send({ orderId });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
