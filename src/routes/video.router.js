import express from "express";
import {
  getListVideos,
  getListVideoType,
  getType,
  getVideoPage,
} from "../controllers/video.controller.js";

const videoRoutes = express.Router();

videoRoutes.get("/get-videos", getListVideos);
videoRoutes.get("/get-type", getType);
videoRoutes.get("/get-video-type-by-id/:typeId", getListVideoType);
videoRoutes.get("/get-video-page/:page/:size", getVideoPage);

export default videoRoutes;
