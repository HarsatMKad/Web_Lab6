import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
	error: { error: Error; message: string },
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction,
) => {
	console.error(error.error);
	res.status(500).json(error);
};
