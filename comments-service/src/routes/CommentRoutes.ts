import express from 'express';
import {
	createComment,
	getComments,
	updateComments,
	deleteComment,
} from '../controllers/CommentController';
import { authenticateToken } from '../middleware/authMiddleware';
import checkRole from '../middleware/checkRole';
import { admin } from '../utils/roles';

const commentRouter = express.Router();

commentRouter.get('/', getComments);
commentRouter.post('/', authenticateToken, createComment);
commentRouter.delete('/:id', authenticateToken, checkRole([admin]), deleteComment);
commentRouter.put('/:id', authenticateToken, updateComments);

export default commentRouter;