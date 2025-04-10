import { Request, Response } from 'express';
import {
	enrollUserInCourse,
	completeLesson,
	uncompleteLesson,
	getEnrollmentStatus,
} from '../services/enrollmentService';
import Enrollment from '../models/EnrollmentModel';
import Lesson from '../models/Lesson';

interface AuthRequest extends Request {
	user?: { id: string };
}

export const enrollUser = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}
		const userId = req.user.id;
		const { courseId } = req.body;
		const enrollment = await enrollUserInCourse(userId, courseId);
		res.status(201).json({ message: 'Пользователь записан на курс.', enrollment: enrollment });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: error });
	}
};

export const completeLessonController = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}
		const userId = req.user.id;
		const { lessonId } = req.body;

		const lesson = await Lesson.findById(lessonId);

		if (!lesson) {
			res.status(404).json({ message: 'Урок не найден.' });
			return;
		}

		const enrollment = await completeLesson(userId, lessonId);
		res.status(201).json({ message: 'Урок завершен.', enrollment: enrollment });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: error });
	}
};

export const uncompleteLessonController = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}
		const userId = req.user.id;
		const { lessonId } = req.body;
		const enrollment = await uncompleteLesson(userId, lessonId);
		res.status(201).json({ message: 'Урок отменен.', enrollment: enrollment });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: error });
	}
};

export const getEnrollmentStatusController = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}
		const userId = req.user.id;
		const { courseId } = req.body;
		const enrollment = await getEnrollmentStatus(userId, courseId);
		if (enrollment) {
			res.status(201).json({ message: enrollment });
		} else {
			res.status(404).json({ message: 'Пользователь не записан на курс.' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error });
	}
};

export const getEnrolledStudents = async (req: Request, res: Response) => {
	try {
		const { courseId } = req.body;
		const enrolledStudents = await Enrollment.find({ course: courseId }).populate('user');

		res.status(201).json({ enrolledStudents });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error });
	}
};
