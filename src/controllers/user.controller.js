import { INTERNAL_SERVER, OK } from "../../const.js";
import pool from "../../db.js";
import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import { Op } from "sequelize"; // Operator - toán tử: and, or , like, in,..

const model = initModels(sequelize);

const createUser = async (req, res) => {
  // let { id, hoTen } = req.params;
  // res.send({ id, hoTen });
  try {
    const { full_name, email, pass_word } = req.body;
    let newUser = await model.users.create({ full_name, email, pass_word });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};

const getUser = async (req, res) => {
  try {
    // const [data] = await pool.query(`SELECT * FROM users LIMIT 1`);
    let { full_name = "" } = req.query;
    let data = await model.users.findAll({
      where: {
        full_name: {
          [Op.like]: `%${full_name}%`,
        },
      },
      // attributes: ["full_name"],
      include: [
        {
          model: model.video,
          as: "videos",
          attributes: ["video_name", "user_id"], // where những column muốn hiển thị
          required: true, // default sẽ kết bảng theo left join, muốn inner join thì true
          include: [
            {
              model: model.video_comment,
              as: "video_comments",
            },
          ],
        },
      ],
    });
    return res.status(OK).json(data);
  } catch (error) {
    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { full_name, pass_word } = req.body;

    let user = await model.users.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cách 1:
    let data = await model.users.update(
      { full_name, pass_word },
      { where: { user_id } }
    );

    // Cách 2:
    // if (full_name) user.full_name = full_name;
    // if (pass_word) user.pass_word = pass_word;
    // await user.save();

    return res.status(OK).json({ message: "User updated successfully!" });
  } catch (error) {
    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    // const [data] = await pool.query(`
    //         DELETE FROM users
    //         WHERE user_id = ${user_id}`);
    let user = await model.users.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.destroy();
    return res.status(OK).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};

export { createUser, getUser, deleteUser, updateUser };
