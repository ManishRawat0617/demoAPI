const User = rquire("../models/userModel.js");

// will get all the user from the database
async function handleGetAllUser(req, res) {
  try {
    const allUser = await User.find();
    res.status(200).json({
      allUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// registering the user
async function handleRegisterUser(req, res, next) {
  try {
    const { email, password, name, phoneNumber, role } = req.body;

    // checking if the email already exists
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
    next();
  } catch (error) {}
}


