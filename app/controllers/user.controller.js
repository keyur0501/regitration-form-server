import { Interceptor } from "../interceptor/interceptor.js";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // Create a new user
  createUser = async (req, res) => {
    try {
      const response = await Interceptor.responseHandler(
        () => this.userService.createUser(req.body),
        res
      );
      res.status(response.success ? 201 : 500).json(response);
    } catch (err) {
      console.error("Error in createUser controller:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  };

  // Verify OTP
  verifyOtp = async (req, res) => {
    const { userId } = req.params; // Assume userId is passed as a URL parameter
    const { otp } = req.body; // Assume OTP is sent in the request body
    return await Interceptor.responseHandler(
      () => this.userService.verifyOtp(userId, otp),
      res
    );
  };
}

export default UserController;
