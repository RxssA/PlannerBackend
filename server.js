require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());               
app.use(express.json());     
app.use(express.urlencoded({ extended: true }));

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("sendMessage", (messageData) => {
        io.emit("receiveMessage", messageData);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// Routes
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
