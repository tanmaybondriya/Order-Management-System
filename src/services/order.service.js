import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";

// export const createOrder = async ({ userId, productId, quantity }) => {
//   if (quantity <= 0) {
//     throw new ApiError(400, "Quantity must be greater than zero");
//   }

//   const product = await Product.findOneAndUpdate(
//     { _id: productId, stock: { $gte: quantity } },
//     { $inc: { stock: -quantity } },
//     { new: true },
//   );

//   if (!product) {
//     throw new ApiError(400, "The stock is less than the quantity");
//   }

//   const order = await Order.create({
//     user: userId,
//     product: productId,
//     quantity,
//   });

//   return order;
// };

export const createOrderWithTransaction = async ({
  userId,
  productId,
  quantity,
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const product = await Product.findOne({
      _id: productId,
      stock: { $gte: quantity },
    }).session(session);

    if (!product) {
      throw new ApiError(400, "Insufficient stock or product not found");
    }

    product.stock -= quantity;
    await product.save({ session });

    const order = await Order.create(
      [
        {
          user: userId,
          product: productId,
          quantity,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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

export const deleteOrder = async ({ userId }) => {
  const result = await Order.deleteMany({
    status: "CANCELLED",
    user: userId,
  });
  if (result.deletedCount === 0) {
    throw new ApiError(400, "No cancelled items available");
  }
  return result;
};
