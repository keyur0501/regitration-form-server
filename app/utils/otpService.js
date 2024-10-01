import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Send OTP using Fast2SMS
export const sendSms = async (phoneNumber, otp) => {
  const API_KEY = process.env.OTP_API_KEY; // Make sure this key is valid
  const url = "https://www.fast2sms.com/dev/bulkV2"; // Verify this is the correct endpoint

  try {
    const response = await axios.post(
      url,
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

    // Log both status and response body for better understanding
    console.log("SMS API response status:", response.status);
    console.log("SMS API response data:", response.data);

    console.log(response.data,"this is the response")

    // Check for success based on API's actual return structure
    if (response.data.return === true) {
      console.log("SMS sent successfully");
      return { success: true };
    } else {
      console.log("Failed to send SMS", response.data);
      return { success: false, message: response.data.message || "Failed to send SMS" };
    }
  } catch (error) {
    console.error("Error sending SMS:", error.response ? error.response.data : error.message);
    return { success: false, message: error.response ? error.response.data : error.message };
  }
};
