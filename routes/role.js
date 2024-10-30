const express = require("express");

const router = express.Router();
const Role = require("../models/roleModel");

router.get("/", (req, res, next) => {
  res.send("Handling role request ");
});

router.post("/api/role/register", async (req, res) => {
  try {
    const { name } = req.body;

    // Checking if role is already exists
    if (await Role.findOne({ name })) {
      return res.status(409).json({
        message: "Role already exist",
      });
    }
    const newRole = await Role.create({
      name,
    });
    return res.status(201).json({
      message: "Role registered successfully",
      id: newRole._id,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
