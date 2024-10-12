import express from "express";
import rootRoutes from "./src/routes/root.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// Tạo object express
const app = express();

// Thêm middleware để đọc data JSON
app.use(express.json());

// Thêm middleware để đọc cookie
app.use(cookieParser());

// Thêm middleware có để FE có thể call API tới BE
app.use(
  cors({
    origin: "http://localhost:3000", // cấp quyền cho FE
    credentials: true, // cho phép FE lấy cookie và lưu vào cookie browser
  })
);

// import rootRoutes
app.use(rootRoutes);

// define port cho BE chạy
app.listen(8080, () => {
  console.log("Server is starting with port 8080");
});
