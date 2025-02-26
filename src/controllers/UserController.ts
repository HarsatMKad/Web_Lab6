import { Request, Response } from "express";
import Users from "../models/User";
import bcrypt from "bcrypt";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userList = await Users.find();
    res.json(userList);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ошибка при получении списка пользователй" });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const user = await Users.findById(id);

    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    res.json({ name: user.name, lastname: user.lastname, email: user.mail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении пользователя" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, lastname, mail, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUsers = new Users({
      name,
      lastname,
      mail,
      password: hashedPassword,
      role,
    });
    await newUsers.save();

    res.status(201).json({
      message: "Пользователь успешно добавлен",
      student: newUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при добавлении пользователя" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    await Users.findByIdAndDelete(id);
    res.status(200).json({ message: "Пользователь успешно удален" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id, name, lastname, mail, password, role } = req.body;

    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ message: "Пользователь не найден" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Users.findByIdAndUpdate(id, {
      name,
      lastname,
      mail,
      hashedPassword,
      role,
    });
    res.status(200).json({ message: "Пользователь успешно обновлен" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
