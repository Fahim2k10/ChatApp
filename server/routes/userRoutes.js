import express from "express";
import {
  checkAuth,
  login,
  signup,
  updateProfile,
} from "../controllers/userController.js";
import { protectedRoutes } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectedRoutes, updateProfile);
userRouter.get("/check", protectedRoutes, checkAuth);

export default userRouter;
