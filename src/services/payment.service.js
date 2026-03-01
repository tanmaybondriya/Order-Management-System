import Order from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";
import crypto from "crypto";

export const createPaymentOrderService = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId }).populate(
    "product",
  ); // finds orderId and userId of the person from the Order table and then populate returns the product object from the orderId

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.payment.status === "paid") {
    throw new ApiError(400, "Order already paid");
  }
  //simulating payment order creation
  //this would is the api of payment gateway used
  const paymentOrder = {
    orderId: order._id,
    amount: order.product.price * order.quantity,
    currency: "INR",
    gatewayOrderId: `pay_${crypto.randomBytes(8).toString("hex")}`,
  };

  return paymentOrder;
};

export const verifyPaymentService = async (orderId, transcationId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) throw new ApiError(404, "Order not found");
  if (order.payment.status === "paid") {
    throw new ApiError(400, "Order already paid");
  }

  //Simulate signature verification
  //In real razorpay this would use crypto.createHmac to verify signature

  const isValid = transcationId.startsWith("pay_");
  if (!isValid) throw new ApiError(400, "Invalid transaction");

  order.payment.status = "paid";
  order.payment.transactionId = transcationId;
  order.payment.paidAt = new Date();
  await order.save();

  return order;
};
