const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

let currentPoll = null;
let answers = {};
let students = [];

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('student-joined', (name) => {
        students.push({ id: socket.id, name });
        socket.broadcast.emit('student-list-updated', students);
    });

    socket.on('create-poll', (poll) => {
        currentPoll = poll;
        answers = {};
        io.emit('new-poll', poll);
    });

    socket.on('submit-answer', ({ name, answer }) => {
        answers[name] = answer;
        io.emit('poll-update', { answers, total: students.length });

        // If all students have answered
        if (Object.keys(answers).length === students.length) {
            io.emit('poll-finished', answers);
        }
    });

    socket.on('disconnect', () => {
        students = students.filter((s) => s.id !== socket.id);
        io.emit('student-list-updated', students);
    });
});

server.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});