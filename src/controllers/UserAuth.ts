import { Request, Response, NextFunction } from 'express';
import { generateToken } from '../services/authService';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { teacher, student } from '../utils/roles';

export const registerStudent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, lastname, email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({ message: 'Пользователь уже зарегистрирован' });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newStudent = new User({
			name,
			lastname,
			email,
			password: hashedPassword,
			role: student,
		});
		await newStudent.save();

		const token = generateToken(newStudent._id);

		res.status(201).json({
			message: 'Регистрация успешна',
			token: token,
		});
	} catch (error) {
		next({ error, message: 'Ошибка при регистрации' });
	}
};

export const registerTeacher = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { name, lastname, email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400).json({ message: 'Пользователь уже зарегистрирован' });
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newStudent = new User({
			name,
			lastname,
			email,
			password: hashedPassword,
			role: teacher,
		});
		await newStudent.save();

		const token = generateToken(newStudent._id);

		res.status(201).json({
			message: 'Регистрация успешна',
			token: token,
		});
	} catch (error) {
		next({ error, message: 'Ошибка при регистрации' });
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			res.status(400).json({ message: 'Неверный email или пароль' });
			return;
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			res.status(400).json({ message: 'Неверный email или пароль' });
			return;
		}

		const token = generateToken(user._id);

		res.status(200).json({ message: 'Логин успешен', token });
	} catch (error) {
		next({ error, message: 'Ошибка при логине' });
	}
};
