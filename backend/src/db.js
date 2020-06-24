// Connect to remote Prisma db, give ability to query with JS
const { Prisma } = require('prisma-binding');

// Create db
const db = new Prisma({
	typeDefs: 'src/generated/prisma.graphql',
	endpoint: process.env.PRISMA_ENDPOINT,
	secret: process.env.PRISMA_SECRET,
	debug: false
});

module.exports = db;
