import { Request, Response, NextFunction } from 'express';
import FeaturedCourses, { IFeaturedCourses } from '../models/FeaturedCourses';
import { FilterQuery } from 'mongoose';
import Course from '../models/Course';

interface AuthRequest extends Request {
	user?: { id: string };
}

export const getFeaturedCourses = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { user_id, course_id } = req.body;

		const filter: FilterQuery<IFeaturedCourses> = {};

		// поиск по пользователю
		if (user_id) {
			filter.user_id = user_id;
		}

		// поиск по курсу
		if (course_id) {
			filter.course_id = course_id;
		}

		const featuredCoursesList = await FeaturedCourses.find(filter)
			.populate('user_id')
			.populate('course_id');

		res.json({ message: 'Список избранных курсов получен', featuredCoursesList });
	} catch (error) {
		next({ error, message: 'Ошибка при получении списка избранных курсов' });
	}
};

export const createFeaturedCourses = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}
		const id = req.user.id;
		const { course_id } = req.params;

		const course = await Course.findById(course_id);

		if (!course) {
			res.status(404).json({ message: 'Курс не найден.' });
			return;
		}

		const featuredCourse = await FeaturedCourses.findOne({ user_id: id, course_id });
		if (featuredCourse) {
			res.status(400).json({ message: 'Курс уже в избранном.' });
			return;
		}

		const newFeaturedCourse = new FeaturedCourses({
			user_id: id,
			course_id,
		});

		await newFeaturedCourse.save();

		res.status(201).json({
			message: 'курс успешно добавлен в избранное',
			course: newFeaturedCourse,
		});
	} catch (error) {
		next({ error, message: 'Ошибка при создании избранного курса' });
	}
};

export const deleteFeaturedCourses = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { course_id } = req.params;

		const featuredCourse = await FeaturedCourses.findById(course_id);
		if (!featuredCourse) {
			res.status(404).json({ message: 'Избранный курс не найден' });
			return;
		}

		await FeaturedCourses.findByIdAndDelete(course_id);
		res.status(200).json({ message: 'Избранный курс успешно удален', featuredCourse });
	} catch (error) {
		next({ error, message: 'Ошибка при удалении избранных курсов' });
	}
};
