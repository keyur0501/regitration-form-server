import { Interceptor } from "../interceptor/interceptor.js";

class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // Create a new user
  createUser = async (req, res) => {
    // Rename res in the response handler to avoid conflict
    await Interceptor.responseHandler(
      () => this.userService.createUser(req.body),
      res
    );
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
