import express, { Request, Response } from 'express';
import config from './utils/config';
import userRouter from './routes/UserRoutes';
import courseRouter from './routes/CourseRoutes';
import tagsRouter from './routes/TagsRoutes';
import featuredCoursesRouter from './routes/FeaturedCoursesRoutes';
import lessonRouter from './routes/LessonRoutes';
import commentRouter from './routes/CommentRoutes';
import enrollmentRoutes from './routes/EnrollmentRoutes';
import { authenticateToken } from './services/middleware/authMiddleware';

const app = express();
const apiRouter = express.Router();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.send('Hello from server!');
});

apiRouter.use('/users', userRouter);
apiRouter.use('/courses', courseRouter);
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/featuredCourses', featuredCoursesRouter);
apiRouter.use('/lessons', lessonRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/enrollment', authenticateToken, enrollmentRoutes);

app.use(config.apiVer, apiRouter);

export default app;
