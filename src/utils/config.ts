import * as dotenv from 'dotenv';
dotenv.config();

const config = {
	port: process.env.PORT || 3000,
	mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017',
	jwtKey: process.env.JWT_KEY || 'secret-key',
	apiVer: '/api',
};

export default config;
