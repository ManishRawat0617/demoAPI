const express = require("express");
const router = express.Router();
const Role = require("../models/roleModel");

// Get all roles
router.get("/", async (req, res, next) => {
  try {
    const roles = await Role.find(); // Fetch all roles from MongoDB
    res.json(roles);
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
router.get("/api/roles", async (req, res) => {
  try {
    const { title } = req.query;
    const query = title ? { title: new RegExp(title, "i") } : {}; // Case-insensitive search
    const filteredRoles = await Role.find(query); // Fetch roles based on query

    res.json(filteredRoles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
