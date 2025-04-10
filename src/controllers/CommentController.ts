import { Request, Response } from 'express';
import Comment, { IComment } from '../models/Comment';
import { FilterQuery } from 'mongoose';

interface AuthRequest extends Request {
	user?: { id: string };
}

export const createComment = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}

		const { lesson, text } = req.body;
		const userId = req.user.id;

		const newComment = new Comment({
			user: userId,
			lesson,
			text,
		});
		await newComment.save();

		res.status(201).json({
			message: 'Комментарий успешно создан',
			tag: newComment,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при создании комментария' });
	}
};

export const getComments = async (req: Request, res: Response) => {
	try {
		const { lesson } = req.body;

		const filter: FilterQuery<IComment> = {};

		if (lesson) {
			filter.lesson = lesson;
		}

		const commentsList = await Comment.find(filter).populate('lesson').populate('user');
		res.json(commentsList);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при получении списка комментариев' });
	}
};

export const updateComments = async (req: Request, res: Response) => {
	try {
		const { id, user, lesson, text } = req.body;

		const comment = await Comment.findById(id);
		if (!comment) {
			res.status(404).json({ message: 'Комментарий не найден' });
			return;
		}

		await Comment.findByIdAndUpdate(id, {
			user,
			lesson,
			text,
		});
		res.status(200).json({ message: 'Комментарий успешно обновлен' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

export const deleteComment = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;

		const comment = await Comment.findById(id);
		if (!comment) {
			res.status(404).json({ message: 'Комментарий не найден' });
			return;
		}

		await Comment.findByIdAndDelete(id);
		res.status(200).json({ message: 'Комментарий успешно удален' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при удалении Комментария' });
	}
};
