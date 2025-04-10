import { Request, Response } from 'express';
import Lesson from '../models/Lesson';

export const createLessons = async (req: Request, res: Response) => {
	try {
		const { title, content, videoUrl, course, order } = req.body;

		const newLesson = new Lesson({
			title,
			content,
			videoUrl,
			course,
			order,
		});
		await newLesson.save();

		res.status(201).json({
			message: 'Урок успешно создан',
			tag: newLesson,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при создании урока' });
	}
};

export const getLessons = async (req: Request, res: Response) => {
	try {
		const lessonList = await Lesson.find().populate('course');
		res.json(lessonList);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при получении списка уроков' });
	}
};

export const updateLessons = async (req: Request, res: Response) => {
	try {
		const { id, title, content, videoUrl, course, order } = req.body;

		const lesson = await Lesson.findById(id);
		if (!lesson) {
			res.status(404).json({ message: 'Урок не найден' });
			return;
		}

		await Lesson.findByIdAndUpdate(id, {
			title,
			content,
			videoUrl,
			course,
			order,
		});
		res.status(200).json({ message: 'Урок успешно обновлен' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

export const deleteLessons = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;

		const lesson = await Lesson.findById(id);
		if (!lesson) {
			res.status(404).json({ message: 'Урок не найден' });
			return;
		}

		await Lesson.findByIdAndDelete(id);
		res.status(200).json({ message: 'Урок успешно удален' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при удалении урока' });
	}
};
