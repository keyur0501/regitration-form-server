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
    const { otp, userId } = req.body; // Assume OTP is sent in the request body
    return await Interceptor.responseHandler(
      () => this.userService.verifyOtp(userId, otp),
      res
    );
  };

  resendOtp = async(req,res) =>{
    const {userId} = req.body;
    return await Interceptor.responseHandler(
      () => this.userService.resendOtp(userId),
      res 
    );
  }

  getAllUsers = async(req,res) =>{
    const { startDate } = req.query;
    return await Interceptor.responseHandler(
      ()=> this.userService.getAllUsers(startDate),
      res
    )
  }
}

export default UserController;
