import express from "express";
import { getCourses, createCourse, getCourseById, deleteCourse, updateCourse } from "../controllers/CourseController";
import { upload, processImage } from "../services/middleware/multerMiddleware";

const router = express.Router();

router.get("/", getCourses)
router.get("/:id", getCourseById)
router.post("/", upload, processImage, createCourse)
router.delete("/:id", deleteCourse)
router.put("/:id", updateCourse)

export default router;