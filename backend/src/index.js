require('dotenv').config({ path: 'variables.env' });
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO Use Express middleware to handle cookies (JWT)
// TODO Use Express middleware to populate current user

server.start(
	{
		cors: {
			credentials: true,
			origin: process.env.FRONTEND_URL
		}
	},
	({ port }) => {
		console.log(`Server running on port http://localhost:${port}`);
	}
);
