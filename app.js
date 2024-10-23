const express = require("express");
const app = express();
const port = process.env.PORT_ENV || 8080;
const User = require("./models/user");

const mongoose = require("mongoose");
app.use(express.json());

// MongoDB is connecting to the API
mongoose
  .connect(
    "mongodb+srv://leowilder1331:9837371512@cluster0.dddhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/DemoApi",
    {}
  )
  .then(() => {
    console.log(mongoose.connect.host);
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Home page of the API
app.get("/", (req, res) => {
  res.send("Prototype of the project");
});

// Registering the user
app.post("/api/auth/register", async (req, res) => {
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

    return res.status(201).json({
      message: "User registered successfully",
      id: newUser._id,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// login the user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
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
      name: user.name,
      email: user.email,
      id: user.id,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FInding user according to the role
app.get("/api/users/role/:role", async (req, res) => {
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

// Start the server
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
