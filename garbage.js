
// This is the server.js code file 
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/webrtcDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Define WebRTC signaling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data);
    });

    socket.on('candidate', (data) => {
        socket.broadcast.emit('candidate', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const Session = require('./models/Session');

app.post('/sessions', async (req, res) => {
    const session = new Session(req.body);
    await session.save();
    res.send(session);
});

app.get('/sessions/:roomId', async (req, res) => {
    const session = await Session.findOne({ roomId: req.params.roomId });
    res.send(session);
});


server.listen(3000, () => {
    console.log('Server listening on port 3000');
});


// session MOdel 
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    roomId: String,
    offer: Object,
    answer: Object,
    candidates: Array,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);


// flutter code for flutter signalping webrtc
