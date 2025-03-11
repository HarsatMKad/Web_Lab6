import express from "express";
import { getCourses, createCourse } from "../controllers/CourseController";
import { upload, processImage } from "../services/middleware/multerMiddleware";

const router = express.Router();

router.get("/", getCourses)
router.post("/", upload, processImage, createCourse)

export default router;