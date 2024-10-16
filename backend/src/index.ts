import type { Socket } from "socket.io";
const express = require('express');
import { createServer } from "node:http";
import { Server } from "socket.io";
const app = express();
const server =  createServer(app);

const io = new Server(server, {
  transports: ['websocket'],
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
  });

  // Handle leaving a room
  socket.on("leave", (roomName: string, name: string) => {
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
    }
  });

  // Handle message broadcasting
  socket.on("message", (msg: Chat, roomname: string) => {
    console.log(`Received message in room ${roomname}:`, msg);
    if (roomname && rooms.has(roomname)) {
      io.to(roomname).emit("message", msg);
    } else {
      console.log(`Room ${roomname} does not exist or has no users.`);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
    rooms.forEach((roomUsers, roomName) => {
      const index = roomUsers.indexOf(socket.id);
      if (index !== -1) {
        roomUsers.splice(index, 1);
      }
    });
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});