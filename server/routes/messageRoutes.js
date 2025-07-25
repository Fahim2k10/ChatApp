import express from "express";
import { protectedRoutes } from "../middleware/auth.js";
import {
  getMessages,
  getUsersForSidebar,
  markMessageAsSeen,
} from "../controllers/messageController.js";
import { sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectedRoutes, getUsersForSidebar);
messageRouter.get("/:id", protectedRoutes, getMessages);
messageRouter.put("/mark/:id", protectedRoutes, markMessageAsSeen);
messageRouter.post("/send", protectedRoutes, sendMessage);

export default messageRouter;
