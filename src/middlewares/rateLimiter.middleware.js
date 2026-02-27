import { rateLimit } from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: process.env.NODE_ENV === "test" ? 1000 : 10,
  message: {
    success: false,
    message: "Too many attempts,please try again after 1 minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
