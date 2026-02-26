import ApiError from "../utils/ApiError.js";

export const authHandler =
  (...roles) =>
  (req, res, next) => {
    const role = req.user.role;
    if (!roles.includes(role)) {
      return next(new ApiError(403, "Not Authorized"));
    }
    next();
  };
