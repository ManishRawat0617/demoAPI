// const express = require("express");
// const app = express();
// const port = process.env.PORT_ENV || 8080;

// // these are the new modules which are added
// const cors = require("cors");
// const http = require("http");
// const server = http.createServer(app);
// const socketIO = require("socket.io");
// const io = socketIO(server);

// app.use(cors());
// app.use(express.json());

// // Form here all the code is old
// const userRouter = require("./routes/user.js");
// const roleRouter = require("./routes/role.js");
// const sessionRouter = require("./routes/session.js");

// const mongoose = require("mongoose");
// app.use(express.json());

// // MongoDB is connecting to the API
// mongoose
//   .connect(
//     "mongodb+srv://leowilder1331:9837371512@cluster0.dddhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/DemoApi",
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => {
//     console.log(mongoose.connect.host);
//     console.log("Database connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// // all the request made for user handles here

// app.use("/user", userRouter);

// // all the request mage for role will handle here

// app.use("/role", roleRouter);

// app.use("/session", sessionRouter);

// // Define WebRTC signaling
// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   socket.on("offer", (data) => {
//     socket.broadcast.emit("offer", data);
//   });

//   socket.on("answer", (data) => {
//     socket.broadcast.emit("answer", data);
//   });

//   socket.on("candidate", (data) => {
//     socket.broadcast.emit("candidate", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// app.use((req, res, next) => {
//   const error = new Error("Not Found");
//   error.status(404);
//   next(error);
// });

// app.use((error, req, res, next) => {
//   res.status(error.status || 500);
//   res.json({
//     error: {
//       message: error.message,
//     },
//   });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server listening at port: ${port}`);
// });

const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");

// Set up the port for the server
const port = process.env.PORT_ENV || 8080;

// Middleware setup
app.use(cors());
app.use(express.json());

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Import routes
const userRouter = require("./routes/user.js");
const roleRouter = require("./routes/role.js");
const sessionRouter = require("./routes/session.js");

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://leowilder1331:9837371512@cluster0.dddhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/DemoApi",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Database connection error:", err);
  });

// API routes
app.use("/user", userRouter);
app.use("/role", roleRouter);
app.use("/session", sessionRouter);

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const callerId = socket.handshake.query?.callerId;
  if (callerId) {
    socket.user = callerId;
    next();
  } else {
    next(new Error("Invalid caller ID"));
  }
});

// Socket.IO event handling for WebRTC signaling and call setup
io.on("connection", (socket) => {
  console.log(`User ${socket.user} connected`);
  socket.join(socket.user);

  // Handle making a call
  socket.on("makeCall", (data) => {
    const { calleeId, sdpOffer } = data;
    console.log(`Call initiated by ${socket.user} to ${calleeId}`);
    socket.to(calleeId).emit("newCall", { callerId: socket.user, sdpOffer });
  });

  // Handle answering a call
  socket.on("answerCall", (data) => {
    const { callerId, sdpAnswer } = data;
    console.log(`${socket.user} answered the call from ${callerId}`);
    socket
      .to(callerId)
      .emit("callAnswered", { callee: socket.user, sdpAnswer });
  });

  // Handle ICE candidate exchange
  socket.on("IceCandidate", (data) => {
    const { calleeId, iceCandidate } = data;
    console.log(`${socket.user} is sending an ICE candidate to ${calleeId}`);
    socket
      .to(calleeId)
      .emit("IceCandidate", { sender: socket.user, iceCandidate });
  });

  // Handle WebRTC signaling events for generic offers, answers, and ICE candidates
  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("candidate", (data) => {
    socket.broadcast.emit("candidate", data);
  });

  // Handle user disconnect
  socket.on("disconnect", (reason) => {
    console.log(`User ${socket.user} disconnected: ${reason}`);
  });

  // Handle errors
  socket.on("error", (err) => {
    console.error(`Socket error for user ${socket.user}:`, err);
  });
});

// Error handling for unmatched routes
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

// Start the HTTP server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
