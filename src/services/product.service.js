import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

export const createProductService = async ({ name, price, stock }) => {
  if (stock < 0) {
    throw new ApiError(400, "stock cannot be negative");
  }

  const product = await Product.create({ name, price, stock });

  return product;
};
