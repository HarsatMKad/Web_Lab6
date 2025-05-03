import express from 'express';
import {
	getCourses,
	createCourse,
	getCourseById,
	deleteCourse,
	updateCourse,
} from '../controllers/CourseController';
import { upload, processImage } from '../middleware/multerMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';
import checkRole from '../middleware/checkRole';
import { teacher, admin } from '../utils/roles';

const courseRoutes = express.Router();

courseRoutes.get('/', getCourses);
courseRoutes.get('/:id', getCourseById);
courseRoutes.post('/', authenticateToken, checkRole([teacher]), upload, processImage, createCourse);
courseRoutes.delete('/:id', authenticateToken, checkRole([teacher, admin]), deleteCourse);
courseRoutes.put('/:id', authenticateToken, checkRole([teacher, admin]), updateCourse);

export default courseRoutes;