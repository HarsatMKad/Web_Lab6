import { Request, Response, NextFunction } from 'express';
import {
	enrollUserInCourse,
	completeLesson,
	uncompleteLesson,
	getEnrollmentStatus,
} from '../services/enrollmentService';
import Enrollment from '../models/Enrollment';
import axios from 'axios';
import config from '../utils/config';

interface AuthRequest extends Request {
	user?: { id: string };
}

export const enrollUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}

		const userId = req.user.id;
		const { courseId } = req.body;

		const userRequest = await axios.get(`${config.userServiceUrl}/${userId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (userRequest.status === 404) {
			res.status(404).json({ message: 'Пользователь не найден.' });
			return;
		}

		const courseRequest = await axios.get(`${config.courseServiceUrl}/${courseId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (courseRequest.status === 404) {
			res.status(404).json({ message: 'Курс не найден.' });
			return;
		}

		const enrollment = await enrollUserInCourse(userId, courseId);
		res.status(201).json({ message: 'Пользователь записан на курс.', enrollment });
	} catch (error) {
		next({ error, message: 'Ошибка при записи пользователя на курс' });
	}
};

export const completeLessonController = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}
		const userId = req.user.id;
		const { lessonId } = req.body;

		const userRequest = await axios.get(`${config.userServiceUrl}/${userId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (userRequest.status === 404) {
			res.status(404).json({ message: 'Пользователь не найден.' });
			return;
		}

        const lessonRequest = await axios.get(`${config.lessonServiceUrl}/${lessonId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (lessonRequest.status === 404) {
			res.status(404).json({ message: 'Урок не найден.' });
			return;
		}

		const enrollment = await completeLesson(userId, lessonId);
		res.status(201).json({ message: 'Урок завершен.', enrollment });
	} catch (error) {
		next({ error, message: 'Ошибка при завершении урока' });
	}
};

export const uncompleteLessonController = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}
		const userId = req.user.id;
		const { lessonId } = req.body;

		const userRequest = await axios.get(`${config.userServiceUrl}/${userId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (userRequest.status === 404) {
			res.status(404).json({ message: 'Пользователь не найден.' });
			return;
		}

        const lessonRequest = await axios.get(`${config.lessonServiceUrl}/${lessonId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (lessonRequest.status === 404) {
			res.status(404).json({ message: 'Урок не найден.' });
			return;
		}

		const enrollment = await uncompleteLesson(userId, lessonId);
		res.status(201).json({ message: 'Урок отменен.', enrollment });
	} catch (error) {
		next({ error, message: 'Ошибка при отмене урока' });
	}
};

export const getEnrollmentStatusController = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}
		const userId = req.user.id;
		const { courseId } = req.body;

		const userRequest = await axios.get(`${config.userServiceUrl}/${userId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (userRequest.status === 404) {
			res.status(404).json({ message: 'Пользователь не найден.' });
			return;
		}

		const courseRequest = await axios.get(`${config.courseServiceUrl}/${courseId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (courseRequest.status === 404) {
			res.status(404).json({ message: 'Курс не найден.' });
			return;
		}

		const enrollment = await getEnrollmentStatus(userId, courseId);

		if (enrollment) {
			res.status(201).json({ message: enrollment });
		} else {
			res.status(404).json({ message: 'Пользователь не записан на курс.' });
		}
	} catch (error) {
		next({ error, message: 'Ошибка при получении статуса' });
	}
};

export const getEnrolledStudents = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { courseId } = req.body;

		const courseRequest = await axios.get(`${config.courseServiceUrl}/${courseId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (courseRequest.status === 404) {
			res.status(404).json({ message: 'Курс не найден.' });
            return;
		}

		const enrolledStudents = await Enrollment.find({ course: courseId }).populate('user');

		res.status(201).json({ message: 'Список студентов, записанных на курс', enrolledStudents });
	} catch (error) {
		next({ error, message: 'Ошибка при получении списка студентов, записанных на курс' });
	}
};
