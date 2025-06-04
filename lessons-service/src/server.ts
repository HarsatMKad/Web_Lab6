import amqp from 'amqplib';
import axios from 'axios';
import { setStatusRequest } from './services/setStatusRequest';
import config from './utils/config';

const lessonUrl = config.lessonServiceUrl
const lessonQueue = config.queue;
const port = config.port;
const apiVer = config.apiVer

export default async function connectRabbitMQ() {
    let connection;
    let retries = 5;
    const deley = 5000;
    while (retries) {
        try {
            connection = await amqp.connect(config.rabbitMQUrl);
            const channel = await connection.createChannel();
            await channel.assertQueue(lessonQueue, { durable: false });

            console.log('[*] Ожидает сообщения. Для выхода нажать CTRL+C', lessonQueue);

            channel.consume(
                lessonQueue,
                async (msg) => {
                    if (msg) {
                        const message = JSON.parse(msg.content.toString());
                        const { requestId, path, method, body, query, headers } = message;

                        const url = `${lessonUrl}:${port}/${apiVer}/${path}`;

                        const axiosConfig = {
                            method: method,
                            url: url,
                            params: query,
                            data: body,
                            headers: headers,
                            validateStatus: (status: number) => {
                                return status >= 200 && status < 600;
                            },
                        };

                        try {
                            const response = await axios(axiosConfig);
                            if (response.status <= 300 && response.status >= 200) {
                                setStatusRequest(
                                    requestId,
                                    response.data,
                                    'Выполнено',
                                    'Запрос выполнен успешно',
                                );
                            } else {
                                setStatusRequest(
                                    requestId,
                                    response.data,
                                    `Ошибка: ${response.status}`,
                                    'При выполнении запроса произошла ошибка',
                                );
                            }
                        } catch (error) {
                            console.log(error);
                        }
                        channel.ack(msg);
                    }
                },
                {
                    noAck: false,
                },
            );
            console.log('Подключено к RabbitMQ');
            return;
        } catch (err) {
            console.log(
                `Ошибка подключение, повторная попытка через ${deley / 1000} секунд...`,
                err,
            );
            retries--;
            await new Promise((resolve) => setTimeout(resolve, deley));
        }
    }
    console.error(`Ошибка подключения к RabbitMQ после нескольких попыток.`);
    process.exit(1);
}