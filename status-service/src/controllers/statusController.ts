import { Request, Response } from 'express';

interface RequestStatuses {
	[requestId: string]: {
		status: string;
		data?: unknown;
		message?: string;
		error?: string;
	};
}

const requestStatuses: RequestStatuses = {};

export const setStatus = async (req: Request, res: Response) => {
    const { requestId } = req.params;

    if (!requestId) {
        res.status(400).json({ message: 'Не найден id запроса' });
        return;
    }

    requestStatuses[requestId] = req.body;
    res.status(200).json({ message: 'Статус изменен' });
};

export const getStatus = async (req: Request, res: Response) => {
    const { requestId } = req.params;

    if (!requestStatuses[requestId]) {
        res.status(404).json({ message: 'Запрос не найден' });
        return;
    }

    res.status(200).json(requestStatuses[requestId]);
};
