const Session = require('../models/sessionModel');
const express = require("express");
const router = express.Router();

// Create a new session
router.post('/sessions', async (req, res, next) => {
  try {
    const { roomId, otherFields } = req.body;

    // Validate request body
    if (!roomId) {
      return res.status(400).json({ error: "roomId is required" });
    }

    // Create and save the session
    const session = new Session(req.body);
    await session.save();

    res.status(201).json(session); // Send 201 status for created resource
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
});

// Get a session by roomId
router.get('/sessions/:roomId', async (req, res, next) => {
  try {
    const session = await Session.findOne({ roomId: req.params.roomId });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    next(error); // Pass errors to the global error handler
  }
});

module.exports = router;
