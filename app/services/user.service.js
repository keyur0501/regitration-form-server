import user from "../models/user.js"; // Assuming your user model is in this directory
import crypto from "crypto"; // To generate random OTPs
import { sendSms } from "../utils/otpService.js";

class UserService {
  constructor() {}

  // Generate a 6-digit OTP
  generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
  };

  // Create a new user with OTP
  createUser = async ({ firstName, lastName, email, phone, loanAmount }) => {
    const otp = this.generateOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    const user = await user.findOne({email});
    if(user)

    const newUser = await user.create({
      firstName,
      lastName,
      email,
      phone,
      loanAmount,
      otp,
      otpExpiry,
      isVerified: false,
    });

    const smsResponse = await sendSms(phone, otp);
    if (!smsResponse.success) {
      return { success: false, message: "Error sending OTP" };
    }

    console.log(`User with email ${email} created and OTP sent`);
    return {
      success: true,
      statustype: "CREATED",
      data: { newUser },
      message: "User created successfully, OTP sent for verification",
    };
  };

  // Verify OTP
  verifyOtp = async (userId, otp) => {
    try {
      // Find the user by ID
      const verifyUser = await user.findById(userId);
      if (!verifyUser) {
        return {
          success: false,
          statustype: "NOT_FOUND",
          message: "User not found",
        };
      }

      // Check if OTP is valid
      if (verifyUser.otp !== otp || Date.now() > verifyUser.otpExpiry) {
        return {
          success: false,
          statustype: "UNAUTHORIZED",
          message: "Invalid or expired OTP",
        };
      }

      // Update user as verified
      verifyUser.isVerified = true;
      verifyUser.otp = null; // Clear the OTP after successful verification
      verifyUser.otpExpiry = null;
      await verifyUser.save(); // Save the updated user

      console.log(`User with ID ${userId} successfully verified`);
      return {
        success: true,
        statustype: "OK",
        message: "User successfully verified",
      };
    } catch (err) {
      console.error("Error details:", err);
      return { success: false, message: "Error verifying OTP" };
    }
  };
}

export default UserService;
