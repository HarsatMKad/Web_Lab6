import express from 'express';
import {
	enrollUser,
	completeLessonController,
	uncompleteLessonController,
	getEnrollmentStatusController,
	getEnrolledStudents,
} from '../controllers/EnrollmentController';
import checkRole from '../services/middleware/checkRole';
import { student } from '../utils/roles';

const router = express.Router();

router.post('/enroll', checkRole([student]), enrollUser);
router.post('/complete-lesson', completeLessonController);
router.post('/uncomplete-lesson', uncompleteLessonController);
router.get('/status', getEnrollmentStatusController);
router.get('/students', getEnrolledStudents);

export default router;
