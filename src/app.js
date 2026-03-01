import express from "express";
import cors from "cors"; // Import cors
import mongoose from "mongoose";
import corsOptions from "./config/corsOptions.js"; // Import your custom config
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
const app = express(); //intitialize express app

app.use(cors(corsOptions));
app.use(express.json()); //middleware to parse JSON request bodies

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    diagnostics: {
      pid: process.pid,
      dbName: mongoose.connection.name || null,
      dbHost: mongoose.connection.host || null,
      dbReadyState: mongoose.connection.readyState,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);
app.use(errorHandler);

export default app;
