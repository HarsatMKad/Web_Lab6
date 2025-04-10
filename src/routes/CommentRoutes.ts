import express from 'express';
import {
	createComment,
	getComments,
	updateComments,
	deleteComment,
} from '../controllers/CommentController';
import { authenticateToken } from '../services/middleware/authMiddleware';
import checkRole from '../services/middleware/checkRole';
import { admin } from '../utils/roles';

const router = express.Router();

router.post('/', authenticateToken, createComment);
router.get('/', getComments);
router.delete('/:id', authenticateToken, checkRole([admin]), deleteComment);
router.put('/', authenticateToken, updateComments);

export default router;
