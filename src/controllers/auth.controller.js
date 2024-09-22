import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";

const model = initModels(sequelize);

const register = async (req, res) => {
  try {
    // post sẽ nhận qua body
    // B1: nhận dữ liệu từ FE
    let { fullName, email, pass } = req.body;

    // B2: kiểm tra email đã tồn tại trong db hay chưa
    const userExist = await model.users.findOne({
      where: { email: email },
    });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "Tài khoản đã tồn tại", data: null });
    }

    //B3: Thêm người dùng mới vào db
    const newUser = await model.users.create({
      full_name: fullName,
      email: email,
      pass_word: pass,
    });

    return res.status(200).json({
      message: "Đăng ký thành công",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

export { register };
