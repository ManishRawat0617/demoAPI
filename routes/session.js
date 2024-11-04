const Session = require('../models/sessionModel');
const express = require("express");
const router = express.Router();


router.post('/sessions', async (req, res) => {
    const session = new Session(req.body);
    await session.save();
    res.send(session);
});

router.get('/sessions/:roomId', async (req, res) => {
    const session = await Session.findOne({ roomId: req.params.roomId });
    res.send(session);
});


module.exports = router ;