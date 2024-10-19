import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const users = new Set(); // Ensure this is a Set

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A new user has connected:", socket.id);
    users.add(socket.id); // This should work if `users` is a Set

    socket.on("username", (data) => {
        // Emit the username to all clients
        io.emit("user connected", data.username);
    });

    socket.on("chat message", (msg) => {
        // Emit the chat message to all clients
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        users.delete(socket.id); // Remove the user when they disconnect
        io.emit("user disconnected", socket.id); 
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("http://localhost:3000/")
});

// server.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on port ${PORT}`);
// });
 
