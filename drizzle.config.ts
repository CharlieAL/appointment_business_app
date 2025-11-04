import { defineConfig } from 'drizzle-kit'

const DB_URL = process.env.DATABASE_URL

if (!DB_URL) {
	throw new Error('DATABASE_URL is not defined in environment variables')
}

export default defineConfig({
	out: './server/db/migrations',
	schema: './server/db/schema/*',
	dialect: 'postgresql',
	dbCredentials: {
		url: DB_URL,
	},
})
