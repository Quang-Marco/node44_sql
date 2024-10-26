import multer, { diskStorage } from "multer";

export const upload = multer({
  storage: diskStorage({
    destination: process.cwd() + "/public/imgs",
    filename: (req, file, cb) => {
      // cb = callback
      cb(null, Date.now() + "_" + file.originalname);
    },
  }),
});
