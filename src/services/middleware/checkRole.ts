import { Request, Response, NextFunction } from 'express';
import Users from '../../models/User';

interface AuthRequest extends Request {
	user?: { id: string };
}

export default function checkRole(role: string[]) {
	return async (req: AuthRequest, res: Response, next: NextFunction) => {
		if (!req.user) {
			res.status(401).json({ message: 'Пользовтель не зарегистрирован.' });
			return;
		}

		const userId = req.user.id;
		const user = await Users.findById(userId);

		if (!user) {
			res.status(404).json({ message: 'Пользователь не найден' });
		}

		if (role.includes(user!.role)) {
			next();
		} else {
			res.status(403).json({ message: 'Отказано, несоответствующая роль.' });
		}
	};
}
