import { Request, Response, NextFunction } from 'express';
import Tag from '../models/Tags';
import slugify from 'slugify';

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tagsList = await Tag.find();
		res.json(tagsList);
	} catch (error) {
		next({ error, message: 'Ошибка при получении списка тегов' });
	}
};

export const createTags = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, description } = req.body;

		const newTag = new Tag({
			name,
			slug: slugify(name),
			description,
		});
		await newTag.save();

		res.status(201).json({
			message: 'Тег успешно создан',
			tag: newTag,
		});
	} catch (error) {
		next({ error, message: 'Ошибка при создании тега' });
	}
};

export const deleteTags = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const id = req.params.id;

		const tag = await Tag.findById(id);
		if (!tag) {
			res.status(404).json({ message: 'Тег не найден' });
			return;
		}

		await Tag.findByIdAndDelete(id);
		res.status(200).json({ message: 'Тег успешно удален', tag });
	} catch (error) {
		next({ error, message: 'Ошибка при удалении тега' });
	}
};
