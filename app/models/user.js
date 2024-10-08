import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the User Schema
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false, // Optional field
  },
  email: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
  },
  loanAmount: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the User model from the schema
const user = mongoose.model("user", userSchema);

export default user;
