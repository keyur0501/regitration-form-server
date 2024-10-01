import user from "../models/user.js"; // Assuming your user model is in this directory
import crypto from "crypto"; // To generate random OTPs
import { sendSms } from "../utils/otpService.js";

class UserService {
  constructor() {}

  // Generate a 6-digit OTP
  generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
  };

  // Create or resend OTP to the user
  createUser = async ({ firstName, lastName, email, phone, loanAmount }) => {
    try {
      console.log(email, phone, "this is the daata");
      let existingUser = await user.findOne({phone});

      const otp = this.generateOtp();
      const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

      // If user exists, check verification status
      if (existingUser) {
        console.log("this is here");
        if (existingUser.isVerified) {
          console.log("existing and verifies")
          return {
            success: false,
            statustype: "FORBIDDEN",
            message: "User is already verified",
          };
        } else {
          // Resend OTP if the user is not verified
          existingUser.otp = otp;
          existingUser.otpExpiry = otpExpiry;
          await existingUser.save();

          const smsResponse = await sendSms(phone, otp);
          if (!smsResponse.success) {
            return {
              success: false,
              message: smsResponse.message || "Error sending OTP",
            };
          }

          return {
            success: true,
            statustype: "CREATED",
            data: existingUser,
            message: "User exists but not verified, OTP re-sent",
          };
        }
      }

      // Create new user if not found
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
        return {
          success: false,
          message: smsResponse.message || "Error sending OTP",
        };
      }
      return {
        success: true,
        statustype: "CREATED",
        data: newUser,
        message: "User created successfully, OTP sent for verification",
      };
    } catch (err) {
      console.error("Error creating user:", err);
      return {
        success: false,
        message: "Error creating user",
      };
    }
  };

  // Resend OTP
  resendOtp = async (userId) => {
    try {
      const existingUser = await user.findOne({_id: userId });
      console.log(existingUser);

      if (!existingUser) {
        return {
          success: false,
          statustype: "NOT_FOUND",
          message: "User not found",
        };
      }

      if (existingUser.isVerified) {
        return {
          success: false,
          statustype: "ALREADY_VERIFIED",
          message: "User is already verified",
        };
      }

      const otp = this.generateOtp();
      const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiration

      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();

      const smsResponse = await sendSms(existingUser.phone, otp);
      if (!smsResponse.success) {
        return { success: false, message: "Error sending OTP" };
      }

      return {
        success: true,
        statustype: "CREATED",
        message: "OTP resent successfully",
      };
    } catch (err) {
      console.error("Error resending OTP:", err);
      return { success: false, message: "Error resending OTP" };
    }
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

      // Check if OTP is valid and not expired
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
