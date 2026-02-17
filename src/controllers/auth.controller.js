import {
  registerUser,
  loginUser,
  currentUser,
} from "../services/auth.service.js";
// import ApiError from "./utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", user));
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const token = await loginUser(req.body);
    res.status(200).json(new ApiResponse(200, "login successfully", { token }));
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await currentUser(userId);
    res.status(200).json(new ApiResponse(200, "Logged In User", user));
  } catch (error) {
    next(error);
  }
};

// export const getCurrentUser = async (req, res) => {
//   res.status(200).json({
//     success: true,
//     statusCode: 200,
//     data: req.user,
//   });
// };
