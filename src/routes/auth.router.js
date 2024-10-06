import express from "express";
import {
  extendToken,
  login,
  loginAsyncKey,
  loginFacebook,
  register,
} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login); // login bằng khóa đối xứng
authRoutes.post("/login-facebook", loginFacebook);
authRoutes.post("/extend-token", extendToken);
authRoutes.post("/login-async-key", loginAsyncKey); // login bằng khóa bất đối xứng

export default authRoutes;
