import { Request, Response } from "express";
import FeaturedCourses, { IFeaturedCourses } from "../models/FeaturedCourses";
import { FilterQuery } from "mongoose";

export const getFeaturedCourses = async (req: Request, res: Response) => {
  try {
    const { user_id, course_id } = req.body;

    const filter: FilterQuery<IFeaturedCourses> = {};

    // поиск по пользователю
    if (user_id) {
      filter.user_id = user_id;
    }

    // поиск по курсу
    if (course_id) {
      filter.course_id = course_id;
    }

    const featuredCoursesList = await FeaturedCourses.find(filter)
      .populate("user_id")
      .populate("course_id");
    res.json(featuredCoursesList);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ошибка при получении списка избранных курсов" });
  }
};

export const createFeaturedCourses = async (req: Request, res: Response) => {
  try {
    const { user_id, course_id } = req.body;

    const newFeaturedCourse = new FeaturedCourses({
      user_id,
      course_id,
    });
    await newFeaturedCourse.save();

    res.status(201).json({
      message: "Тег успешно создан",
      tag: newFeaturedCourse,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ошибка при получении списка избранных курсов" });
  }
};

export const deleteFeaturedCourses = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const featuredCourses = await FeaturedCourses.findById(id);
    if (!featuredCourses) {
      res.status(404).json({ message: "Избранныйе курсы не найден" });
      return;
    }

    await FeaturedCourses.findByIdAndDelete(id);
    res.status(200).json({ message: "Избранные курсы успешно удален" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка при получении избранных курсов" });
  }
};
