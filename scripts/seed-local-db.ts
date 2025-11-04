import { seed } from 'drizzle-seed'
import { db, pool } from '~/server/db'
import { schema } from '~/server/db/schema'

const seedLocalDb = async () => {
	return await seed(db, schema.business).catch((error) => {
		console.error('Error during seeding:', error)
		throw error
	})
}

seedLocalDb()
	.then(() => {
		console.log('Local database seeded successfully.')
		return pool.end()
	})
	.catch((error) => {
		console.error('Error seeding local database:', error)
		return pool.end()
	})
