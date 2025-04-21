import { Request, Response, NextFunction } from 'express';
import Course, { ICourse } from '../models/Course';
import slugify from 'slugify';
import { FilterQuery } from 'mongoose';
import fs from 'fs';

const storageDirectory = 'uploads/';

export const getCourses = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { search, category, level, sort, page, limit } = req.body;

		const filter: FilterQuery<ICourse> = {};

		//поиск по названию
		if (search) {
			filter.title = { $regex: search, $options: 'i' };
		}

		//фильтрация
		if (category) {
			filter.category = category;
		}

		if (level) {
			filter.level = level;
		}

		//пагинация
		const pageNumber = parseInt(page || '1', 10);
		const limitNumber = parseInt(limit || '10', 10);
		const skip = (pageNumber - 1) * limitNumber;

		const courseList = await Course.find(filter)
			.sort(sort)
			.skip(skip)
			.limit(limitNumber)
			.populate('tags');

		res.json({ message: 'Получен список курсов', courseList });
	} catch (error) {
		next({ error, message: 'Ошибка при получении курсов' });
	}
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;

		const course = await Course.findById(id).populate('tags');

		if (!course) {
			res.status(404).json({ message: 'Курс не найден' });
			return;
		}

		res.json({ message: 'Курс получен', course });
	} catch (error) {
		next({ error, message: 'Ошибка при получении курса' });
	}
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.body.image) {
			res.status(400).json({ message: 'Изображение не найдено' });
			return;
		}

		const { title, description, price, category, level, published, author, tags } = req.body;

		const imagePath = req.body.image;

		const newCourse = new Course({
			title,
			slug: slugify(title),
			description,
			price,
			image: imagePath,
			category,
			level,
			published,
			author,
			tags,
		});
		await newCourse.save();

		res.status(201).json({
			message: 'Курс успешно добавлен',
			course: newCourse,
		});
	} catch (error) {
		if (req.body.image) {
			try {
				await fs.unlinkSync(storageDirectory + req.body.image);
			} catch (unlinkError) {
				console.error('Ошибка при удалении загруженного файла:', unlinkError);
			}
		}

		next({ error, message: 'Ошибка при создании курса' });
	}
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;

		const course = await Course.findById(id);

		if (!course) {
			res.status(404).json({ message: 'Курс не найден' });
			return;
		}

		if (course.image) {
			try {
				await fs.unlinkSync(storageDirectory + course.image);
			} catch (unlinkError) {
				console.error('Ошибка при удалении изображении курса:', unlinkError);
			}
		}

		await Course.findByIdAndDelete(id);

		res.status(200).json({ message: 'Курс успешно удален', course });
	} catch (error) {
		next({ error, message: 'Ошибка при удалении курса' });
	}
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;

		const { title, description, price, image, category, level, published, author, tags } =
			req.body;

		const newCourse = {
			title,
			slug: slugify(title),
			description,
			price,
			image,
			category,
			level,
			published,
			author,
			tags,
		};

		const course = await Course.findByIdAndUpdate(id, newCourse, {
			new: true,
			runValidators: true,
		});

		if (!course) {
			res.status(404).json({ message: 'Курс не найден' });
			return;
		}

		res.status(200).json({ message: 'Курс успешно обновлен', course });
	} catch (error) {
		next({ error, message: 'Ошибка при обновлении курса' });
	}
};
