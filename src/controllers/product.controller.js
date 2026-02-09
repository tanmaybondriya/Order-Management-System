import ApiResponse from "../utils/ApiResponse.js";
import { createProductService } from "../services/product.service.js";

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
