import express from 'express';
import {
	getCourses,
	createCourse,
	getCourseById,
	deleteCourse,
	updateCourse,
} from '../controllers/CourseController';
import { upload, processImage } from '../services/middleware/multerMiddleware';
import { authenticateToken } from '../services/middleware/authMiddleware';
import checkRole from '../services/middleware/checkRole';
import { teacher, admin } from '../utils/roles';

const router = express.Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authenticateToken, checkRole([teacher]), upload, processImage, createCourse);
router.delete('/:id', authenticateToken, checkRole([teacher, admin]), deleteCourse);
router.put('/:id', authenticateToken, checkRole([teacher, admin]), updateCourse);

export default router;
