import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs"; // fs = file system

let accessTokenPrivateKey = fs.readFileSync("access_token.private.key");
let accessTokenPublicKey = fs.readFileSync("access_token.public.key");
let refreshTokenPrivateKey = fs.readFileSync("refresh_token.private.key");
let refreshTokenPublicKey = fs.readFileSync("refresh_token.public.key");

// Đọc file .env
dotenv.config();

// create function createToken
export const createToken = (data) => {
  return jwt.sign({ payload: data }, process.env.ACCESS_TOKEN_KEY, {
    algorithm: "HS256",
    expiresIn: "10s",
  });
};

export const createTokenAsyncKey = (data) => {
  return jwt.sign({ payload: data }, accessTokenPrivateKey, {
    algorithm: "RS256",
    expiresIn: "10s",
  });
};

export const createRefreshToken = (data) => {
  return jwt.sign({ payload: data }, process.env.REFRESH_TOKEN_KEY, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
};

export const createRefreshTokenAsyncKey = (data) => {
  return jwt.sign({ payload: data }, refreshTokenPrivateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
};

export const verifyToken = (token) => {
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    return true;
  } catch (error) {
    return false;
  }
};

export const verifyTokenAsyncKey = (token) => {
  try {
    jwt.verify(token, accessTokenPublicKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Create middleware token
export const middlewareToken = (req, res, next) => {
  let { token } = req.headers;
  let checkToken = verifyToken(token);
  if (checkToken) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export const middlewareTokenAsyncKey = (req, res, next) => {
  let { token } = req.headers;
  let checkToken = verifyTokenAsyncKey(token);
  if (checkToken) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};
