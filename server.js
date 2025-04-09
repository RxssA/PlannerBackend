require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { 
    cors: { origin: "*" },
    maxHttpBufferSize: 5e6 // 5MB max message size
});

app.use(cors());               
app.use(express.json({ limit: '50mb' }));     
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error:", err));

// Make io available to routes
app.set('io', io);

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("sendMessage", async (messageData) => {
        console.log("Received message via socket.io:", messageData);
        io.emit("receiveMessage", messageData);
        
        // Save message to database
        if (messageData.activityId) {
            try {
                console.log(`Saving socket.io message to activity ${messageData.activityId}`);
                const Activity = require('./schemas/activity');
                const activity = await Activity.findById(messageData.activityId);
                
                if (activity) {
                    if (!activity.messages) {
                        activity.messages = [];
                    }
                    
                    activity.messages.push({
                        sender: messageData.sender,
                        text: messageData.text,
                        image: messageData.image,
                        timestamp: new Date(messageData.timestamp)
                    });
                    
                    await activity.save();
                    console.log(`Socket.io message saved to activity ${messageData.activityId}, total messages: ${activity.messages.length}`);
                } else {
                    console.log(`Activity not found for socket.io message: ${messageData.activityId}`);
                }
            } catch (error) {
                console.error(`Error saving socket.io message to activity ${messageData.activityId}:`, error);
            }
        } else {
            console.log("No activity ID provided for socket.io message");
        }
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
app.use('/api/chat', require('./routes/chatRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
