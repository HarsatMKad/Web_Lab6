import express from 'express';
import mongoose from 'mongoose';
import config from './utils/config';
import enrollmentRouter from './routers/EnrollmentRoutes';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/authMiddleware';
import connectRabbitMQ from './server';

const port = config.port;
const apiVer = config.apiVer
const dbUrl = config.mongoURL;

const app = express();

app.use(express.json());

app.use(`/${apiVer}`, authenticateToken, enrollmentRouter);
app.use(errorHandler);

const connectDB = async (retryCount = 0) => {
	const maxRetries = 5;
	try {
		await mongoose.connect(dbUrl!);
    connectRabbitMQ().then(()=>{
      app.listen(port, () => {
        console.log(`Enrollment Service запущен на порту: ${port}`);
      });
    })
	} catch (error) {
		console.error('Ошибка подключения к базе данных:', error);
		if (retryCount < maxRetries) {
			setTimeout(() => connectDB(retryCount + 1), 5000);
		} else {
			console.error('Превышено максимальное количество подключений.');
			process.exit(1);
		}
	}
};

connectDB();
