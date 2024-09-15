import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
} from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.post("/:id/:hoTen", createUser);
userRoutes.get("/get-users", getUser);
// userRoutes.put("/update-users", (req, res) => {});
userRoutes.delete("/delete-user/:user_id", deleteUser);

export default userRoutes;
