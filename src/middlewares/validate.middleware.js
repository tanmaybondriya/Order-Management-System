import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errMessage = result.error.issues
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(",");
    return next(new ApiError(400, errMessage));
  }
  req.body = result.data;
  console.log("PID:", process.pid);
  debugger;
  next();
};
