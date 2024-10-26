import express from "express";
import rootRoutes from "./src/routes/root.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Tạo object express
const app = express();

// Thêm middleware có để FE có thể call API tới BE
app.use(
  cors({
    origin: "http://localhost:3000", // cấp quyền cho FE
    credentials: true, // cho phép FE lấy cookie và lưu vào cookie browser
  })
);

// Tạo http server
const server = createServer(app);

// Tạo socket.io server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let number = 0;
// Lắng nghe event kết nối từ client (FE) qua socket.io
io.on("connection", (socket) => {
  console.log("a user connected");

  // khi client disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // khi client gửi tin nhắn
  socket.on("chat-message", async ({ userId, content }) => {
    console.log(`Message from ${userId}: ${content}`);
    let newMessage = {
      user_id: +userId,
      content,
      date: new Date(),
    };
    // Lưu message vào db
    await prisma.chat.create({ data: newMessage });

    io.emit("chat-message", { userId, content }); // gửi tin nhắn đến tất cả client
  });

  socket.on("increment", () => {
    console.log("FE send click");
    number++;
    io.emit("send-new-number", number); // gửi số đếm đến tất cả client
  });

  socket.on("decrement", () => {
    console.log("FE send click");
    number--;
    io.emit("send-new-number", number); // gửi số đếm đến tất cả client
  });
});

// define middleware để public forder
app.use(express.static("."));

// Thêm middleware để đọc data JSON
app.use(express.json());

// Thêm middleware để đọc cookie
app.use(cookieParser());

// import rootRoutes
app.use(rootRoutes);

// define port cho BE chạy
server.listen(8080, () => {
  console.log("Server is starting with port 8080");
});
