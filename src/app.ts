import express, { Request, Response } from "express";
import userRouter from "./routes/UserRoutes";
import courseRouter from "./routes/CourseRoutes";
import tagsRouter from "./routes/TagsRoutes";
import featuredCoursesRouter from "./routes/FeaturedCoursesRoutes";
import lessonRouter from "./routes/LessonRoutes";
import commentRouter from "./routes/CommentRoutes";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from server!");
});

app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/featuredCourses", featuredCoursesRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/comments", commentRouter);

export default app;
