import { Request, Response } from 'express';
import Users from '../models/User';
import bcrypt from 'bcrypt';

interface AuthRequest extends Request {
	user?: { id: string };
}

export const getUsers = async (req: Request, res: Response) => {
	try {
		const userList = await Users.find();
		res.json(userList);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при получении списка пользователй' });
	}
};

export const getUserInfo = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}

		const user = await Users.findById(req.user.id);

		if (!user) {
			res.status(404).json({ message: 'Пользователь не найден' });
			return;
		}

		res.json({ name: user.name, lastname: user.lastname, email: user.email });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при получении пользователя' });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const { name, lastname, email, password, role } = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUsers = new Users({
			name,
			lastname,
			email,
			password: hashedPassword,
			role,
		});
		await newUsers.save();

		res.status(201).json({
			message: 'Пользователь успешно добавлен',
			student: newUsers,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Ошибка при добавлении пользователя' });
	}
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользователь не зарегистрирован.' });
			return;
		}

		const id = req.user.id;

		const user = await Users.findById(id);
		if (!user) {
			res.status(404).json({ message: 'Пользователь не найден' });
			return;
		}

		await Users.findByIdAndDelete(id);
		res.status(200).json({ message: 'Пользователь успешно удален' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};

export const updateUser = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user) {
			res.status(401).json({ message: 'Пользователь не зарегистрирован.' });
			return;
		}

		const id = req.user.id;
		const { name, lastname, email, password, role } = req.body;

		const user = await Users.findById(id);
		if (!user) {
			res.status(404).json({ message: 'Пользователь не найден' });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await Users.findByIdAndUpdate(id, {
			name,
			lastname,
			email,
			hashedPassword,
			role,
		});
		res.status(200).json({ message: 'Пользователь успешно обновлен' });
	} catch (error) {
		res.status(500).json({ message: error });
	}
};
