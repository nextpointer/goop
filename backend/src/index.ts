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

// create a map for Rooms
const rooms = new Map();
interface Chat {
  message: string;
  mine?: boolean;
  userId: string;
  username: string;
}

io.on("connection", (socket:Socket) => {
  console.log("a new client connected");

  // join a room
  socket.on("join", (roomname: string) => {
    if (!rooms.has(roomname)) {
      rooms.set(roomname, []);
    }
    rooms.get(roomname).push(socket.id);
    socket.join(roomname);
    console.log(`client join room ${roomname}`);
    io.to(roomname).emit("newUSer", rooms.get(roomname));
  });

  // leave a room
  socket.on("leave", (roomName: string,name:string) => {
    if (rooms.has(roomName)) {
      const room = rooms.get(roomName);
      const index = room.indexOf(socket.id);
      if (index !== -1) {
        room.splice(index, 1);
      }
      socket.leave(roomName);
      console.log(`${name} left room ${roomName}`);
    }
  });

  // handle the msg
  socket.on("message", (msg:Chat, roomname:string) => {
    console.log(`Received Message in room ${roomname}:`, msg);
    if (roomname) {
      io.to(roomname).emit("message", msg);
    } else {
      io.emit("message", msg);
    }
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("a client disconnected");
    for (const room of rooms.values()) {
      const index = room.indexOf(socket.id);
      if (index !== -1) {
        room.splice(index, 1);
      }
    }
  });
});


server.listen(3000, () => {
  console.log("server is running on 3000");
});
