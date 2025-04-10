import Enrollment, { IEnrollment } from '../models/EnrollmentModel';
import Lesson from '../models/Lesson';
import Users from '../models/User';
import Course from '../models/Course';
import { Schema } from 'mongoose';

const calculateCourseProgress = async (
	userId: string,
	courseId: Schema.Types.ObjectId,
): Promise<number> => {
	try {
		const enrollment = await Enrollment.findOne({ user: userId, course: courseId });

		if (!enrollment) {
			return 0;
		}

		const totalLessons = await Lesson.countDocuments({ course: courseId });

		const completedLessonsCount = enrollment.lessonsCompleted.length;

		if (totalLessons === 0) {
			return 0;
		}

		const result = (completedLessonsCount / totalLessons) * 100;

		return result;
	} catch (error) {
		console.error(error);
		return 0;
	}
};

const enrollUserInCourse = async (userId: string, courseId: string): Promise<IEnrollment> => {
	try {
		const user = await Users.findById(userId);
		const course = await Course.findById(courseId);

		if (!user || !course) {
			throw new Error('Отсутствует пользователь или курс.');
		}

		const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
		if (existingEnrollment) {
			throw new Error('Пользователь уже записан на этот курс.');
		}

		const newEnrollment = new Enrollment({
			user: userId,
			course: courseId,
		});

		await newEnrollment.save();

		return newEnrollment;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const completeLesson = async (
	userId: string,
	lessonId: Schema.Types.ObjectId,
): Promise<IEnrollment> => {
	try {
		const user = await Users.findById(userId);
		const lesson = await Lesson.findById(lessonId);

		if (!user || !lesson) {
			throw new Error('Отсутствует пользователь, курс или урок');
		}

		const enrollment = await Enrollment.findOne({ user: userId, course: lesson.course });
		if (!enrollment) {
			throw new Error('Пользователь не записан на курс');
		}

		if (enrollment.lessonsCompleted.includes(lessonId)) {
			throw new Error('Урок уже выполнен');
		}

		enrollment.lessonsCompleted.push(lessonId);
		await enrollment.save();

		enrollment.progress = await calculateCourseProgress(userId, lesson.course);
		await enrollment.save();

		return enrollment;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const uncompleteLesson = async (
	userId: string,
	lessonId: Schema.Types.ObjectId,
): Promise<IEnrollment> => {
	try {
		const user = await Users.findById(userId);
		const lesson = await Lesson.findById(lessonId);

		if (!user || !lesson) {
			throw new Error('Отсутствует пользователь, курс или урок.');
		}

		const enrollment = await Enrollment.findOne({ user: userId, course: lesson.course });
		if (!enrollment) {
			throw new Error('Пользователь не записан на этот курс.');
		}

		if (!enrollment.lessonsCompleted.includes(lessonId)) {
			throw new Error('Урок не пройден.');
		}

		const lessonIndex = enrollment.lessonsCompleted.indexOf(lessonId)
		enrollment.lessonsCompleted.splice(lessonIndex, 1);
		await enrollment.save();

		enrollment.progress = await calculateCourseProgress(userId, lesson.course);
		await enrollment.save();

		return enrollment;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const getEnrollmentStatus = async (
	userId: string,
	courseId: Schema.Types.ObjectId,
): Promise<IEnrollment | null> => {
	try {
		const enrollment = await Enrollment.findOne({ user: userId, course: courseId })
			.populate('user', 'name lastname')
			.populate('course', 'title description')
			.populate('lessonsCompleted', 'title');

		if (!enrollment) {
			return null;
		}

		return enrollment;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export {
	enrollUserInCourse,
	completeLesson,
	uncompleteLesson,
	getEnrollmentStatus,
	calculateCourseProgress,
};
