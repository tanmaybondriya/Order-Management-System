import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

export const createProductService = async ({ name, price, stock }) => {
  if (stock < 0) {
    throw new ApiError(400, "stock cannot be negative");
  }

  const product = await Product.create({ name, price, stock });

  return product;
};

export const getProductService = async ({
  page,
  limit,
  sort,
  order,
  filters,
}) => {
  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const [products, total] = await Promise.all([
    Product.find(filters)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(total / limit);
  return { products, pagination: { total, page, limit, totalPages } };
};
