import express from "express";
import { createLessons, getLessons, updateLessons, deleteLessons } from "../controllers/LessonController";
import { authenticateToken } from "../services/middleware/authMiddleware";
import checkRole from "../services/middleware/checkRole";
import { teacher, admin } from "../utils/roles";

const router = express.Router();

router.post("/", authenticateToken, checkRole([teacher]), createLessons)
router.get("/", getLessons)
router.put("/", authenticateToken, checkRole([teacher]), updateLessons)
router.delete("/:id", authenticateToken, checkRole([teacher, admin]), deleteLessons)

export default router;