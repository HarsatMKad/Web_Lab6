import express from 'express';
import config from './utils/config';
import { setStatus, getStatus } from './controllers/statusController';

const app = express();
const port = config.port;

app.use(express.json());

app.post('/api/status/:requestId', setStatus)
app.get('/api/status/:requestId', getStatus)

app.listen(port, () => {
	console.log(`Status Service Прослушивает порт: ${port}`);
});
