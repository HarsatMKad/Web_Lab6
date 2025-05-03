import express from 'express';
import {
	enrollUser,
	completeLessonController,
	uncompleteLessonController,
	getEnrollmentStatusController,
	getEnrolledStudents,
} from '../controllers/EnrollmentController';
import checkRole from '../middleware/checkRole';
import { student } from '../utils/roles';

const enrollmentRouter = express.Router();

enrollmentRouter.post('/enroll', checkRole([student]), enrollUser);
enrollmentRouter.post('/complete-lesson', completeLessonController);
enrollmentRouter.post('/uncomplete-lesson', uncompleteLessonController);
enrollmentRouter.get('/status', getEnrollmentStatusController);
enrollmentRouter.get('/students', getEnrolledStudents);

export default enrollmentRouter;