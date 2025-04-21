import express from 'express';
import config from './utils/config';
import userRouter from './routes/UserRoutes';
import courseRouter from './routes/CourseRoutes';
import tagsRouter from './routes/TagsRoutes';
import featuredCoursesRouter from './routes/FeaturedCoursesRoutes';
import lessonRouter from './routes/LessonRoutes';
import commentRouter from './routes/CommentRoutes';
import enrollmentRoutes from './routes/EnrollmentRoutes';
import { authenticateToken } from './services/middleware/authMiddleware';
import { errorHandler } from './services/middleware/errorHandler';

const app = express();
const apiRouter = express.Router();

app.use(express.json());

apiRouter.use('/users', userRouter);
apiRouter.use('/courses', courseRouter);
apiRouter.use('/tags', authenticateToken, tagsRouter);
apiRouter.use('/featuredCourses', authenticateToken, featuredCoursesRouter);
apiRouter.use('/lessons', lessonRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/enrollment', authenticateToken, enrollmentRoutes);

app.use(config.apiVer, apiRouter);

app.use(errorHandler);

export default app;
