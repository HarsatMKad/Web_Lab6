import { Request, Response } from 'express';
import Tag from '../models/Tags';
import slugify from 'slugify';

export const getTags = async (req: Request, res: Response) => {
	try {
		const tagsList = await Tag.find();
		res.json(tagsList);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при получении списка тегов' });
	}
};

export const createTags = async (req: Request, res: Response) => {
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
		console.error(error);
		res.status(500).json({ message: 'Ошибка при получении списка тегов' });
	}
};

export const deleteTags = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;

		const tag = await Tag.findById(id);
		if (!tag) {
			res.status(404).json({ message: 'Тег не найден' });
			return;
		}

		await Tag.findByIdAndDelete(id);
		res.status(200).json({ message: 'Тег успешно удален' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при получении списка тегов' });
	}
};
