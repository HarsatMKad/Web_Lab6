import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sendMessageToQueue } from '../services/sendMessageToQueue';
import { setStatusRequest } from '../services/setStatusRequest';
import config from '../utils/config';

const userRoute = express.Router();

userRoute.all('/users*', async (req: Request, res: Response) => {
	const requestId = uuidv4();
	const path = req.originalUrl.replace('/api/users', '');
	const method = req.method.toLowerCase();

	try {
		if (!(await setStatusRequest(requestId, 'В ожидании', 'Запрос находится в очереди'))) {
			res.status(500).json({ error: 'Не удалось поставить запрос в очередь' });
			return;
		}

		const message = {
			requestId: requestId,
			path: path,
			method: method,
			body: req.body,
			query: req.query,
			headers: {
				Authorization: req.header('Authorization'),
				'content-type': req.headers['content-type'],
			},
		};

		await sendMessageToQueue(config.userServiceQueue, message);

		res.status(200).json({
			message: 'Запрос принят.',
			requestId,
		});
	} catch (error) {
		console.error('Ошибка маршрутизации для user-service:', error);
		res.status(500).json({ error: 'Ошибка на сервере' });
	}
});

export default userRoute;