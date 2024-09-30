import { Router } from "express";
import UserService from "../services/user.service.js";
import UserController from "../controllers/user.controller.js";

const userRouter = Router();

const userService = new UserService();
const userController = new UserController(userService);

userRouter.post("/create-user", userController.createUser);
userRouter.post("/verify-otp", userController.verifyOtp);

export default userRouter;
