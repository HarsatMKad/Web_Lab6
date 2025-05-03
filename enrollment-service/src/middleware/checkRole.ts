import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import config from '../utils/config';

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
		const userRequest = await axios.get(`${config.userServiceUrl}/${userId}`, {
			validateStatus: function (status) {
				return status >= 200 && status < 600;
			},
		});

		if (userRequest.status === 404) {
			res.status(404).json({ message: 'Пользователь не найден' });
		}

		const user = userRequest.data;

		if (role.includes(user!.role)) {
			next();
		} else {
			res.status(403).json({ message: 'Отказано, несоответствующая роль.' });
		}
	};
}
