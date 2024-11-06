const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const role = require("../models/role.json");

// Get all roles
router.get("/", async (req, res, next) => {
  try {
    // const roles = await Role.find(); // Fetch all roles from MongoDB
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register a new role
router.post("/api/role/register", async (req, res) => {
  try {
    const { name } = req.body;

    // Check if role already exists
    if (await Role.findOne({ name })) {
      return res.status(409).json({
        message: "Role already exists",
      });
    }

    const newRole = await Role.create({ name });
    return res.status(201).json({
      message: "Role registered successfully",
      id: newRole._id,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Filter roles by title
router.post("/api/roles/role", async (req, res) => {
  try {
    // Extract all the user from the db having this role

    const { role } = req.body;

    // const users = await User.find();
    const users = await User.where("role").equals(role);

    // Check if any users were found
    if (!users.length) {
      return res.status(404).json({ message: "No users found for this role" });
    }

    // Send the array of users as a response
    return res.status(200).json({ users });
  } catch (error) {
    // Handle potential errors
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
