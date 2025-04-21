import { Request, Response, NextFunction } from 'express';
import Lesson from '../models/Lesson';

export const createLessons = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, content, videoUrl, course, order } = req.body;

		const lesson = new Lesson({
			title,
			content,
			videoUrl,
			course,
			order,
		});
		await lesson.save();

		res.status(201).json({
			message: 'Урок успешно создан',
			lesson,
		});
	} catch (error) {
		next({ error, message: 'Ошибка при создании урока' });
	}
};

export const getLessons = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const lessonList = await Lesson.find().populate('course');
		res.json({ message: 'Список уроков получен', lessonList });
	} catch (error) {
		next({ error, message: 'Ошибка при получении списка уроков' });
	}
};

export const updateLessons = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const lesson = await Lesson.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!lesson) {
			res.status(404).json({ message: 'Урок не найден' });
			return;
		}

		res.status(200).json({ message: 'Урок успешно обновлен', lesson });
	} catch (error) {
		next({ error, message: 'Ошибка при обновлении урока' });
	}
};

export const deleteLessons = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const lesson = await Lesson.findById(id);
		if (!lesson) {
			res.status(404).json({ message: 'Урок не найден' });
			return;
		}

		await Lesson.findByIdAndDelete(id);
		res.status(200).json({ message: 'Урок успешно удален', lesson });
	} catch (error) {
		next({ error, message: 'Ошибка при удалении урока' });
	}
};
