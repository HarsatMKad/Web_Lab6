import express from 'express';
import {
	getUsers,
	getUserById,
	createUser,
	deleteUser,
	updateUser,
	getUserInfo,
} from '../controllers/UserController';
import { authenticateToken } from '../middleware/authMiddleware';
import { registerStudent, registerTeacher, login } from '../controllers/UserAuth';

const router = express.Router();

router.get('/', getUsers);
router.get('/info', authenticateToken, getUserInfo);
router.get('/:id', getUserById)
router.post('/', createUser);
router.delete('/:userId', authenticateToken, deleteUser);
router.put('/', authenticateToken, updateUser);

router.post('/login', login);
router.post('/register/student', registerStudent);
router.post('/register/teacher', registerTeacher);

export default router;