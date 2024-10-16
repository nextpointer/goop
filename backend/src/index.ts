import type { Socket } from "socket.io";
const express = require('express');
import { createServer } from "node:http";
import { Server } from "socket.io";
const app = express();
const server =  createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

interface Chat {
  message: string;
  mine?: boolean;
  userId: string;
  username: string;
}

type RoomMap = Map<string, string[]>;

const rooms: RoomMap = new Map();

io.on("connection", (socket: Socket) => {
  console.log("A new client connected:", socket.id);

  // Handle joining a room
  socket.on("join", (roomname: string) => {
    try {
      if (!rooms.has(roomname)) {
        rooms.set(roomname, []);
      }
      const roomUsers = rooms.get(roomname);
      if (roomUsers) {
        roomUsers.push(socket.id);
      }
      socket.join(roomname);
      console.log(`Client joined room ${roomname}`);
      io.to(roomname).emit("newUser", roomUsers);
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", "Failed to join room");
    }
  });

  // Handle leaving a room
  socket.on("leave", (roomName: string, name: string) => {
    try {
      if (rooms.has(roomName)) {
        const room = rooms.get(roomName);
        if (room) {
          const index = room.indexOf(socket.id);
          if (index !== -1) {
            room.splice(index, 1);
          }
        }
        socket.leave(roomName);
        console.log(`${name} left room ${roomName}`);
      } else {
        console.log(`Room ${roomName} does not exist`);
        socket.emit("error", "Room does not exist");
      }
    } catch (error) {
      console.error("Error leaving room:", error);
      socket.emit("error", "Failed to leave room");
    }
  });

  // Handle message broadcasting
  socket.on("message", (msg: Chat, roomname: string) => {
    try {
      console.log(`Received message in room ${roomname}:`, msg);
      if (roomname && rooms.has(roomname)) {
        io.to(roomname).emit("message", msg);
      } else {
        console.log(`Room ${roomname} does not exist or has no users.`);
        socket.emit("error", "Room does not exist or has no users");
      }
    } catch (error) {
      console.error("Error broadcasting message:", error);
      socket.emit("error", "Failed to broadcast message");
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    try {
      console.log("A client disconnected:", socket.id);
      rooms.forEach((roomUsers, roomName) => {
        const index = roomUsers.indexOf(socket.id);
        if (index !== -1) {
          roomUsers.splice(index, 1);
        }
      });
    } catch (error) {
      console.error("Error handling disconnection:", error);
    }
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
});

// Handle unhandled exceptions
process.on("uncaughtException", (error) => {
  console.error("Unhandled exception:", error);
  process.exit(1);
});
