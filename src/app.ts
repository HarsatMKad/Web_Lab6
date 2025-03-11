import express, { Request, Response } from "express";
import userRouter from "./routes/UserRoutes";
import courseRouter from "./routes/CourseRoutes"

const app = express();

app.use(express.json()); 

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

//app.use('/uploads', express.static('uploads'));

app.use("/api/users", userRouter)
app.use("/api/courses", courseRouter)

export default app; 