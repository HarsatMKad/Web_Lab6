import { Request, Response } from "express";
import { generateToken } from "../services/authService";
import User from "../models/User";
import bcrypt from "bcrypt";

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { name, lastname, mail, password } = req.body;

    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      res.status(400).json({ message: "Пользователь уже зарегистрирован" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new User({
      name,
      lastname,
      mail,
      password: hashedPassword,
      role: 1,
    });
    await newStudent.save();

    const token = generateToken(newStudent._id);

    res.status(201).json({
      message: "Регистрация успешна",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при регистрации" });
  }
};

export const registerTeacher = async (req: Request, res: Response) => {
  try {
    const { name, lastname, mail, password } = req.body;

    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      res.status(400).json({ message: "Пользователь уже зарегистрирован" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new User({
      name,
      lastname,
      mail,
      password: hashedPassword,
      role: 2,
    });
    await newStudent.save();

    const token = generateToken(newStudent._id);

    res.status(201).json({
      message: "Регистрация успешна",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при регистрации" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });

    if (!user) {
      res.status(400).json({ message: "Неверный email или пароль" });
      return;
    }

    console.log(user);

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log(passwordMatch);

    if (!passwordMatch) {
      res.status(400).json({ message: "Неверный email или пароль" });
      return;
    }

    const token = generateToken(user._id);
    console.log(token);

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error });
  }
};
