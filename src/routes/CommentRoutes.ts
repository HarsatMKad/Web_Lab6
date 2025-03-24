import express from "express";
import { createComment, getComments, updateComments, deleteComment } from "../controllers/CommentController";
import { authenticateToken } from "../services/middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, createComment)
router.get("/", getComments)
router.delete("/:id", deleteComment)
router.put("/", updateComments)

export default router;