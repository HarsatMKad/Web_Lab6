import express from "express";
import { getFeaturedCourses, createFeaturedCourses, deleteFeaturedCourses } from "../controllers/FeaturedCoursesController";
import { authenticateToken } from "../services/middleware/authMiddleware";

const router = express.Router();

router.get("/", getFeaturedCourses)
router.post("/", authenticateToken, createFeaturedCourses)
router.delete("/:id", deleteFeaturedCourses)

export default router;