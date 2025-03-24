import express from "express";
import { createLessons, getLessons, updateLessons, deleteLessons } from "../controllers/LessonController";

const router = express.Router();

router.post("/", createLessons)
router.get("/", getLessons)
router.put("/", updateLessons)
router.delete("/:id", deleteLessons)

export default router;