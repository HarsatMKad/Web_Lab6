import express from "express";
import { getFeaturedCourses, createFeaturedCourses, deleteFeaturedCourses } from "../controllers/FeaturedCoursesController";

const router = express.Router();

router.get("/", getFeaturedCourses)
router.post("/", createFeaturedCourses)
router.delete("/:id", deleteFeaturedCourses)

export default router;