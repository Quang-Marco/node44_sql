// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "avatar", // define folder trên cloudinary
//     format: (req, file) => {
//       const validImgFormat = ["png", "jpg", "jpeg", "gif", "webp"];

//       const ext = file.mimetype.split("/")[1]; // ext = extension: phần mở rộng
//       if (!validImgFormat.includes(ext)) {
//         // throw new Error("Invalid image format!");
//         return ext;
//       }
//       //   return `${Date.now()}-${file.originalname}.${ext}`;
//       return ".png";
//     },
//     // transformation: [
//     //   {
//     //     width: 200,
//     //     height: 200,
//     //     crop: "fill",
//     //   },
//     // ],
//     public_id: (req, file) => file.originalname.split(".")[0],
//   },
// });

// export const uploadCloud = multer({ storage });

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "avatar", // define folder trên cloudinary
    format: async (req, file) => {
      const validImgFormat = ["png", "jpeg", "gif", "webp", "heic"];

      const fileFormat = file.mimetype.split("/")[1];

      if (validImgFormat.includes(fileFormat)) {
        return fileFormat;
      }
      return ".png";
    },
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

export const uploadCloud = multer({ storage });
