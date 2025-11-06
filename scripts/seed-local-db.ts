import { db, pool } from '~/server/db'
import { generateMockData } from '~/server/mocks'

const seedLocalDb = async () => {
	const { businesses, services, users } = generateMockData()

	console.log('businesses:', businesses)
	console.log('services:', services)
	console.log('users:', users)
}

seedLocalDb()
	.catch((err) => {
		console.error('Error seeding local database:', err)
	})
	.finally(() => {
		pool.end()
	})
