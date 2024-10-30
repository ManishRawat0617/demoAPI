const express = require("express");
const app = express();
const port = process.env.PORT_ENV || 8080;

const userRouter = require("./routes/user.js");
const roleRouter = require("./routes/role.js");

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

// all the request made for user handles here
app.use("/user", userRouter);

// all the request mage for role will handle here

app.use("/role", roleRouter);


app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server listening at port: ${port}`);
});
