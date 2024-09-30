import user from "../models/user.js"; // Assuming your user model is in this directory
import bcrypt from "bcrypt";
import crypto from "crypto"; // To generate random OTPs

class UserService {
  constructor() {}

  // Create a new user
  generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
  };

  // Create a new user with OTP
  createUser = async ({ firstName, lastName, email, phone, password }) => {
    try {
      // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate an OTP for verification
      const otp = this.generateOtp();
      const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      // Create a new user
      const newUser = await user.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword, // Hashed password
        otp, // Store OTP in user model
        otpExpiry, // Store OTP expiry
        isVerified: false, // Set user as not verified initially
      });

      // Send the OTP via Twilio SMS
      const smsResponse = await sendSms(phone, `Your OTP is: ${otp}`);
      if (!smsResponse.success) {
        throw new Error("Failed to send OTP");
      }

      console.log(`User with email ${email} created and OTP sent`);
      return {
        success: true,
        statustype: "CREATED",
        data: { userId: user._id },
        message: "User created successfully, OTP sent for verification",
      };
    } catch (err) {
      return { success: false, message: "Error creating user" };
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
      await user.save();

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
