import multer from "multer";
import sharp from "sharp";
import path from "path";
import { NextFunction, Request, Response } from "express";
import {v4 as uuidv4} from 'uuid';
import config from "../utils/config";

const storageDirectory = "uploads";
const WATERMARK_PATH = "wtrm.jpg";
const compressionLevel = 80;

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.fileSize,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(config.imageTypes)) {
      return cb(new Error("Пожалуйста, загрузите изображение"));
    }
    cb(null, true);
  },
}).single("image");


export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return next(); 
    }

    const filename = uuidv4()+".jpg";
    const imagePath = path.join(storageDirectory, filename);

    await sharp(req.file.buffer)
      .resize({ width: 800 })
      .composite([
        {
          input: WATERMARK_PATH,
          gravity: "southwest",
          blend: "over",
        },
      ])
      .jpeg({ quality: compressionLevel })
      .toFile(imagePath);

    req.body.image = filename;
    next();
  } catch (error) {
    console.error("Ошибка при обработке изображения:", error);

    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Ошибка при обработке изображения" });
    return;
  }
};