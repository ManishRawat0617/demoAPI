const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Username
  name: {
    type: String,
    required: true,
  },
  // Roles where the user is an expert
  role: {
    type: [String], // Specifies the role is an array of strings
    required: false,
  },
  // User Email
  email: {
    type: String,
    required: true,
    unique: true, // Email should be unique
  },
  // User Password (should be hashed in real applications)
  password: {
    type: String,
    required: true,
  },
  // Rating
  rating: {
    type: Number, // Store rating as a number
    required: false,
  },
  // Phone Number
  phoneNumber: {
    type: Number,
    required: true,
    unique:true
  },
});

// Define the User model
const User = mongoose.model("Users", userSchema);

module.exports = User;
