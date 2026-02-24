import ApiResponse from "../utils/ApiResponse.js";
import {
  createProductService,
  getProductService,
} from "../services/product.service.js";

export const createProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.body);

    res
      .status(201)
      .json(new ApiResponse(201, "product created succesfully", product));
  } catch (error) {
    next(error);
  }
};

export const getAllProduct = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 5,
      sort = "createdAt",
      order = "desc",
      ...filters
    } = req.query;

    const products = await getProductService({
      page: Number(page) || 1,
      limit: Number(limit) || 5,
      sort,
      order,
      filters,
    });
    res
      .status(200)
      .json(new ApiResponse(200, "Products Fetched succesfully", products));
  } catch (error) {
    next(error);
  }
};
