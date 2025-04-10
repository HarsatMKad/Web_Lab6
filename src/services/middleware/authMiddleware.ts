import { Request, Response, NextFunction } from 'express';
import config from '../../utils/config';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
	user?: { id: string };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
	const token = req.header('Authorization');

	if (!token) {
		res.status(401).json({ message: 'Доступ отклонен. Нет токена доступа.' });
		return;
	}

	try {
		const decoded = jwt.verify(token, config.jwtKey) as {
			id: string;
		};

		req.user = { id: decoded.id };

		next();
	} catch {
		res.status(400).json({ message: 'Неверный токен.' });
	}
};
