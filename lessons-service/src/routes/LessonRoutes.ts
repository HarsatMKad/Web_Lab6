import express from 'express';
import {
	createLessons,
	getLessons,
	updateLessons,
	deleteLessons,
	getLessonById,
	getCountDocumentsByCourse,
} from '../controllers/LessonController';
import { authenticateToken } from '../middleware/authMiddleware';
import checkRole from '../middleware/checkRole';
import { teacher, admin } from '../utils/roles';

const lessonRouter = express.Router();

lessonRouter.post('/', authenticateToken, checkRole([teacher]), createLessons);
lessonRouter.get('/', getLessons);
lessonRouter.get('/:id', getLessonById);
lessonRouter.get('/count/:courseId', getCountDocumentsByCourse);
lessonRouter.put('/:id', authenticateToken, checkRole([teacher]), updateLessons);
lessonRouter.delete('/:id', authenticateToken, checkRole([teacher, admin]), deleteLessons);

export default lessonRouter;
