import {
  createPaymentOrderService,
  verifyPaymentService,
} from "../services/payment.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const paymentOrder = await createPaymentOrderService(orderId, userId);
    res
      .status(200)
      .json(new ApiResponse(200, "Payment order created", paymentOrder));
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { orderId, transactionId } = req.body;
    const userId = req.user.id;

    const order = await verifyPaymentService(orderId, transactionId, userId);
    res.status(200).json(200, "Payment successful", order);
  } catch (error) {
    next(error);
  }
};
