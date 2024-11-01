const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Role = require("../models/roleModel");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const crypto = require("crypto");
const secretKey = "123456";
// const secretKey = crypto.randomBytes(64).toString("hex");
// console.log("JWT Secret Key:", secretKey);

// Getting the profile of the single user
router.get("/profile", (req, res) => {
  res.send("This is the profile page of the app");
});

// Get the list of all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get all the role stored by the user
router.get("/roles", async (req, res, next) => {
  try {
    const allUser = await User.find({}, "role");
    res.status(200).json(allUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Registering the user
router.post("/auth/register", async (req, res) => {
  try {
    // Getting the values from the request body
    const { name, email, phoneNumber, password, role } = req.body;

    // Checking if email already exists
    if (await User.findOne({ email })) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    // Creating a new user
    const newUser = await User.create({
      name,
      email,
      password,
      phoneNumber,
      role,
    });

    // const roles = role.map((r) => ({ value: r }));

    // // Insert all items into the database as individual documents
    // const savedRole = await Role.insertMany(roles);

    return res.status(201).json({
      message: "User registered successfully",
      id: newUser._id,
      // roles: savedRole,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// login the user
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const accesstoken = jwt.sign({ email, password }, secretKey, {
      expiresIn: "1h",
    });
    if (!email || !password) {
      return res.status(422).json({
        message: "Please fill all the field ",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email is not found" });
    }

    if (user.password != password) {
      return res.status(200).json({
        message: "Password is incorrect !!",
      });
    }
    return res.status(200).json({
      id: user.id,
      // name: user.name,
      // email: user.email,

      role: user.role,
      accesstoken: accesstoken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify the User details
router.get("/verify/:accesstoken", async (req, res, next) => {
  try {
    const { accesstoken } = req.params; // Get token from URL params
    const decoded = jwt.verify(accesstoken, secretKey); // Verify token

    res.status(200).json({
      message: "Token is valid",
      user: decoded,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({
      message: "An error occurred during verification",
    });
  }
});

// FInding user according to the role
router.get("/roles/:role", async (req, res) => {
  try {
    // Extract the role from the URL parameters
    const { role } = req.params;

    // Find all users that match the given role
    const users = await User.find({ role: role });

    // Check if any users were found
    if (!users.length) {
      return res.status(404).json({ message: "No users found for this role" });
    }

    // Send the array of users as a response
    return res.status(200).json({
      message: "Users found",
      users: users,
    });
  } catch (err) {
    // Handle errors
    return res.status(500).json({ message: err.message });
  }
});

// Form here the addition code
// // JWT Verification Middleware
// const verifyToken = (req, res, next) => {
//   const token = req.headers["authorization"]?.split(" ")[1];

//   if (!token) {
//     return res.status(403).json({ message: "Access token is required" });
//   }

//   try {
//     const decoded = jwt.verify(token, secretKey);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Token has expired" });
//     } else if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ message: "Invalid token" });
//     }
//     return res.status(500).json({ message: "Failed to authenticate token" });
//   }
// };

// // Login Route
// router.post("/api/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Compare passwords
//     // const isPasswordValid = await bcrypt.compare(password, user.password);
//     // if (!isPasswordValid) {
//     //   return res.status(401).json({ message: "Invalid email or password" });
//     // }

//     // Generate JWT access token
//     const accessToken = jwt.sign(
//       { userId: user._id, email: user.email, role: user.role },
//       secretKey,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       accessToken,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Protected Route Example
// router.get("/api/protected", verifyToken, (req, res) => {
//   res.status(200).json({
//     message: "You have access to this protected route",
//     user: req.user,
//   });
// });
module.exports = router;
