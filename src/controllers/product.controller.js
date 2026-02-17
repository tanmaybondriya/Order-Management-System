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
    const product = await getProductService(req.body);
    res
      .status(200)
      .json(new ApiResponse(200, "Products Fetched succesfully", product));
  } catch (error) {
    next(error);
  }
};
