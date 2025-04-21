import { Request, Response, NextFunction } from 'express';
import Comment, { IComment } from '../models/Comment';
import { FilterQuery } from 'mongoose';

interface AuthRequest extends Request {
	user?: { id: string };
}

export const createComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
			comment: newComment,
		});
	} catch (error) {
		next({ error, message: 'Ошибка при создании комментария' });
	}
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { lesson } = req.body;

		const filter: FilterQuery<IComment> = {};

		if (lesson) {
			filter.lesson = lesson;
		}

		const commentsList = await Comment.find(filter).populate('lesson').populate('user');
		res.json({ message: 'Список комментариев получен', commentsList });
	} catch (error) {
		next({ error, message: 'Ошибка при получении списка комментариев' });
	}
};

export const updateComments = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const comment = await Comment.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!comment) {
			res.status(404).json({ message: 'Комментарий не найден' });
			return;
		}

		res.status(200).json({ message: 'Комментарий успешно обновлен', comment });
	} catch (error) {
		next({ error, message: 'Ошибка при обновлении комментария' });
	}
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;

		const comment = await Comment.findById(id);
		if (!comment) {
			res.status(404).json({ message: 'Комментарий не найден' });
			return;
		}

		await Comment.findByIdAndDelete(id);
		res.status(200).json({ message: 'Комментарий успешно удален', comment });
	} catch (error) {
		next({ error, message: 'Ошибка при удалении Комментария' });
	}
};
