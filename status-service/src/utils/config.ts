import * as dotenv from 'dotenv';
dotenv.config();

const config = {
	port: process.env.PORT || 3003,
};

export default config;