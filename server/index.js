const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://stellular-peony-934835.netlify.app",
        methods: ["GET", "POST"]
    }
});

app.use(
    cors({
        origin: "https://stellular-peony-934835.netlify.app",
        methods: ["GET", "POST"]
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

let currentPoll = null;
let answers = {};
let students = [];

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('student-joined', (name) => {
        students.push({ id: socket.id, name });
        socket.broadcast.emit('student-list-updated', students);
    });

    socket.on('request-current-poll', () => {
        if (currentPoll) {
            socket.emit('new-poll', currentPoll);
        }
    });

    socket.on('create-poll', (poll) => {
        const allAnswered = Object.keys(answers).length === students.length;
        const canCreatePoll = !currentPoll || allAnswered;

        if (canCreatePoll) {
            currentPoll = poll;
            answers = {};
            io.emit('new-poll', poll);
        } else {
            socket.emit('poll-error', 'Cannot create a new poll until all students have answered.');
        }
    });

    socket.on('submit-answer', ({ name, answer }) => {
        answers[name] = answer;

        const logLine = `${new Date().toISOString()} - ${name} answered: ${answer}\n`;
        fs.appendFile('poll_submissions.log', logLine, (err) => {
            if (err) console.error('Error writing to file:', err);
        });

        io.emit('poll-update', {
            answers,
            total: students.length
        });

        if (Object.keys(answers).length === students.length) {
            io.emit('poll-finished', answers);
        }
    });

    socket.on('disconnect', () => {
        students = students.filter((s) => s.id !== socket.id);
        io.emit('student-list-updated', students);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});