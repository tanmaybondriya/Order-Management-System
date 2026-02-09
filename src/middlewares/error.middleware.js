const errorHandler = (err, req, res, next) => {
  console.error("ERROR 💥:", err);
  if (res.headersSent) {
    return next(err); // IMPORTANT
  }

  // const statusCode = err.statusCode || 500;
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server error",
  });
};
export default errorHandler;
