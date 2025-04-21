import { Request, Response, NextFunction } from 'express';
import Users from '../models/User';
import bcrypt from 'bcrypt';

interface AuthRequest extends Request {
	user?: { id: string };
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userList = await Users.find();
		res.json(userList);
	} catch (error) {
		next({ error, message: 'Ошибка при получении списка пользователей' });
	}
};

export const getUserInfo = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
		next({ error, message: 'Ошибка при получении информации пользователя' });
	}
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
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
			message: 'Пользователь успешно создан',
			student: newUsers,
		});
	} catch (error) {
		next({ error, message: 'Ошибка при создании пользователя' });
	}
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
		res.status(200).json({ message: 'Пользователь успешно удален', user });
	} catch (error) {
		next({ error, message: 'Ошибка при удалении курса' });
	}
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
		next({ error, message: 'Ошибка при обновлении пользователя' });
	}
};
