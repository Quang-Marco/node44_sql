import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  uploadAvatar,
} from "../controllers/user.controller.js";
import { upload } from "../config/upload.js";
import { uploadCloud } from "../config/uploadCloud.js";

const userRoutes = express.Router();

userRoutes.post("/create-user", createUser);
userRoutes.get("/get-users", getUser);
userRoutes.put("/update-user/:user_id", updateUser);
userRoutes.delete("/delete-user/:user_id", deleteUser);
userRoutes.post("/upload-avatar", upload.single("hinhAnh"), uploadAvatar);
userRoutes.post(
  "/upload-avatar-cloud",
  uploadCloud.single("hinhAnh"),
  (req, res) => {
    try {
      let file = req.file;

      res.status(200).json(file);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

export default userRoutes;
