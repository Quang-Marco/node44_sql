import initModels from "../models/init-models.js";
import sequelize from "../models/connect.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import transporter from "../config/transporter.js";
import {
  createRefreshToken,
  createRefreshTokenAsyncKey,
  createToken,
  createTokenAsyncKey,
} from "../config/jwt.js";
import { PrismaClient } from "@prisma/client";
import speakeasy from "speakeasy";

const model = initModels(sequelize);

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    let { fullName, email, pass } = req.body;
    // validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email is invalid" });
    }
    // validate pass
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passRegex.test(pass)) {
      return res.status(400).json({ message: "Password is invalid" });
    }

    // validate fullName
    // ...

    // Kiểm tra xem email đã đăng ký tài khoản trước đó hay chưa
    // const userExist = await model.users.findOne({
    //   where: { email },
    // });
    const userExist = await prisma.users.findFirst({ where: { email } });
    if (userExist) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }

    // Tạo secret cho login 2 lớp
    const secret = speakeasy.generateSecret({ length: 15 });

    // Thêm người dùng mới vào db
    const newUser = await prisma.users.create({
      data: {
        full_name: fullName,
        email,
        pass_word: bcrypt.hashSync(pass, 10),
        secret: secret.base32,
      },
    });

    // Cấu hình info email
    const mailOption = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Welcome to Our service",
      text: `Hello ${fullName}! Best regards.`,
    };

    // sendEmail(mailOption);
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({
        message: "Registered successfully",
        data: newUser,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};

const login = async (req, res) => {
  try {
    let { email, pass } = req.body;
    let user = await model.users.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // mã hóa password trước khi so sánh
    const isMatch = bcrypt.compareSync(pass, user.pass_word);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is wrong" });
    }
    // tạo token JWT
    let token = createToken({ userId: user.user_id });
    let refreshToken = createRefreshToken({ userId: user.user_id });
    await model.users.update(
      { refresh_token: refreshToken },
      { where: { user_id: user.user_id } }
    );
    // Lưu refresh token vào cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // cookie ko thể truy cập từ javascript
      secure: false, // chỉ chạy localhost
      sameSite: "Lax", //  đảm bảo cookie đc gửi trong các domain khác nhau
      maxAge: 7 * 24 * 60 * 60 * 1000, // thời gian tồn tại cookie trong browser
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
    // chuyển user sang userProfile để trả về FE
    // const userProfile = {
    //   userId: user.user_id,
    //   fullName: user.full_name,
    //   email: user.email,
    // };
    // res.json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const loginFacebook = async (req, res) => {
  try {
    let { id, email, name } = req.body;
    let user = await model.users.findOne({ where: { face_app_id: id } });

    if (!user) {
      user = await model.users.create({
        full_name: name,
        email,
        face_app_id: id,
      });
    }

    const token = createToken({ userId: user.user_id });
    return res.status(200).json({
      message: "Login Facebook successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const extendToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const refreshToken = req.cookies.refreshToken; // khi lấy ra cookies có s
    if (!refreshToken) {
      return res.status(401);
    }

    const checkRefreshToken = await model.users.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!checkRefreshToken) {
      return res.status(401);
    }

    const newToken = createTokenAsyncKey({ userId: checkRefreshToken.user_id });

    return res.status(200).json({
      message: "Success",
      newToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const loginAsyncKey = async (req, res) => {
  try {
    let { email, pass } = req.body;

    let user = await model.users.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // mã hóa password trước khi so sánh
    const isMatch = bcrypt.compareSync(pass, user.pass_word);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is wrong" });
    }
    // tạo token JWT
    let token = createTokenAsyncKey({ userId: user.user_id });
    let refreshToken = createRefreshTokenAsyncKey({ userId: user.user_id });
    await model.users.update(
      { refresh_token: refreshToken },
      { where: { user_id: user.user_id } }
    );
    // Lưu refresh token vào cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // cookie ko thể truy cập từ javascript
      secure: false, // chỉ chạy localhost
      sameSite: "Lax", //  đảm bảo cookie đc gửi trong các domain khác nhau
      maxAge: 7 * 24 * 60 * 60 * 1000, // thời gian tồn tại cookie trong browser
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;

    let user = await model.users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // tạo mã xác nhận
    const randomCode = crypto.randomBytes(5).toString("hex");
    // cập nhật mã xác nhận vào db
    await model.code.create({
      code: randomCode,
      expired: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    });

    // cấu hình info email
    const mailOption = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Reset Password Code",
      // text: `Hello! Your reset password code is ${randomCode}. Please use this code to reset your password. If you didn't request this, please ignore this email.`,
      html: `<p>Hello! Your reset password code is: <h1>${randomCode}</h1>. Please use this code to reset your password. If you didn't request this, please ignore this email.</p>`,
    };
    // sendEmail(mailOption);
    transporter.sendMail(mailOption, (err, info) => {
      if (err) {
        return res.status(500).json({ message: "Error sending email" });
      }
      return res
        .status(200)
        .json({ message: "Reset password code has been sent to your email" });
    });

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};

const changePassword = async (req, res) => {
  try {
    let { email, code, pass } = req.body;

    let user = await model.users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }
    let codeDB = await model.code.findOne({ where: { code } });
    if (!codeDB) {
      return res.status(401).json({ message: "Invalid code" });
    }

    // mã hóa password mới
    const hashedPass = bcrypt.hashSync(pass, 10);
    await model.users.update(
      { pass_word: hashedPass },
      { where: { user_id: user.user_id } }
    );
    // user.password = hashedPass;
    // user.save();

    await model.code.destroy({ where: { code } });

    return res
      .status(200)
      .json({ message: "Password has been changed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error" });
  }
};

export {
  register,
  login,
  loginFacebook,
  extendToken,
  loginAsyncKey,
  forgotPassword,
  changePassword,
};
