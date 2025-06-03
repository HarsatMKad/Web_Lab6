import express from 'express';
import statusRoute from './routes/statusRoutes';
import QueueRoutes from './routes/QueueRoutes';
import config from './utils/config';

const app = express();
const port = config.port;

app.use(express.json());

const routes = [
  { path: 'users', queue: config.userServiceQueue },
  { path: 'courses', queue: config.courseServiceQueue },
  { path: 'tags', queue: config.tagServiceQueue },
  { path: 'lessons', queue: config.lessonServiceQueue },
  { path: 'comments', queue: config.commentServiceQueue },
  { path: 'enrollment', queue: config.enrollmentServiceQueue },
];

routes.forEach((route) => {
	const routeUnit = QueueRoutes(route.path, route.queue)
	app.use(`/${config.apiVer}`, routeUnit);
});

app.use(`/${config.apiVer}`, statusRoute);

app.listen(port, () => {
	console.log(`API Gateway прослушивает порт: ${port}`);
});
