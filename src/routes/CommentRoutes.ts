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

router.get('/', getComments);
router.post('/', authenticateToken, createComment);
router.delete('/:id', authenticateToken, checkRole([admin]), deleteComment);
router.put('/:id', authenticateToken, updateComments);

export default router;
