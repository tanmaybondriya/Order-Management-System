import express from "express";
import cors from "cors"; // Import cors
import corsOptions from "./config/corsOptions.js"; // Import your custom config
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express(); //intitialize express app

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json()); //middleware to parse JSON request bodies

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

app.use(errorHandler);

export default app;
