import twilio from "twilio";

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendSms = async (to, message) => {
  try {
    const smsResponse = await client.messages.create({
      body: message,
      from: twilioPhoneNumber, // Your Twilio phone number
      to, // The phone number you're sending the message to
    });

    console.log(`Message sent to ${to}: ${smsResponse.sid}`);
    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error(`Error sending SMS to ${to}: ${error}`);
    return {
      success: false,
      message: "Failed to send OTP",
    };
  }
};
