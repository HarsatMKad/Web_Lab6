import express from "express";
import {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserInfo,
} from "../controllers/UserController";
import { authenticateToken } from "../services/middleware/authMiddleware";
import { registerStudent, registerTeacher, login } from "../controllers/UserAuth";

const router = express.Router();

router.get("/", authenticateToken, getUsers);
router.post("/", createUser);
router.delete("/", authenticateToken, deleteUser);
router.put("/", authenticateToken, updateUser);

router.get("/info", authenticateToken, getUserInfo);
router.post("/login", login);
router.post("/register/student", registerStudent);
router.post("/register/teacher", registerTeacher);

export default router;
