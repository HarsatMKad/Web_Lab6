import { Request, Response, NextFunction } from "express";

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).json({ message: "Доступ отклонен. Нет токена доступа." });
    return;
  }
  next();
};
