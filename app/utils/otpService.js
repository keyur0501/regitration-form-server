import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Send OTP using Fast2SMS
export const sendSms = async (phoneNumber, otp) => {
  const API_KEY = process.env.OTP_API_KEY; // Replace with your Fast2SMS API key

  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "otp",
        variables_values: otp,
        numbers: phoneNumber,
      },
      {
        headers: {
          authorization: API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response, "response");

    if (response.data.return) {
      console.log("SMS sent successfully");
      return { success: true };
    } else {
      console.log("Failed to send SMS");
      return { success: false, message: "Failed to send SMS" };
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, message: error.message };
  }
};
