import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

//Express server
const app = express();
const server = http.createServer(app);

//socket.io
export const io = new Server(server, {
  cors: { origin: "*" },
});

//store users
export const userSocketMap = {}; //userId: socketId

//connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connected", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  //show niggas am online gng

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("disconnected", userId);
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

//routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//connect to mongodb
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("server running on port " + PORT));
