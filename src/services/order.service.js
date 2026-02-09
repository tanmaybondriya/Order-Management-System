import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";

export const createOrder = async ({ userId, productId, quantity }) => {
  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be greater than zero");
  }

  const product = await Product.findOneAndUpdate(
    { _id: productId, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true },
  );

  if (!product) {
    throw new ApiError(400, "The stock is less than the quantity");
  }

  const order = await Order.create({
    user: userId,
    product: productId,
    quantity,
  });

  return order;
};

export const getOrderHistory = async ({ userId, status }) => {
  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  return Order.find(query)
    .populate("product", "name price")
    .sort({ createdAt: -1 });
};

export const cancelledOrder = async ({ userId, orderId }) => {
  console.log("userId recieved", userId);

  console.log("orderId recieved", orderId);
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order doesn't exists");
  }

  if (order.user.toString() !== userId) {
    throw new ApiError(403, "Not authorized to cancel this order");
  }
  if (order.status === "DELIVERED") {
    throw new ApiError(400, "Delivered items cannot be cancelled");
  }
  if (order.status === "CANCELLED") {
    throw new ApiError(400, "Item is already cancelled");
  }

  await Product.updateOne(
    { _id: order.product },
    { $inc: { stock: order.quantity } },
  );

  order.status = "CANCELLED";
  await order.save();

  return order;
};
