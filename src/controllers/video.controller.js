import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from "sequelize"; // Operator - toán tử: and, or , like, in,..

const model = initModels(sequelize);

const getListVideos = async (req, res) => {
  try {
    let data = await model.video.findAll();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

export { getListVideos };
