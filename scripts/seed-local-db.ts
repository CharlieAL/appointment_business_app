import { db, pool } from '~/server/db'
import { appointment } from '~/server/db/schema/appointment'
import { user } from '~/server/db/schema/auth'
import { business } from '~/server/db/schema/business'
import { client } from '~/server/db/schema/client'
import { configuration } from '~/server/db/schema/configuration'
import { dailySchedule } from '~/server/db/schema/daily-schedule'

import { service } from '~/server/db/schema/service'

import { generateMockData } from '~/server/mocks'

const seedLocalDb = async () => {
	const {
		businesses,
		services,
		users,
		configurations,
		clients,
		dailySchedules,
		appointments,
	} = generateMockData()
	//todo: delete existing data if exists
	console.log('seeding business...')
	await db.insert(business).values(businesses)
	console.log('seeding services')
	await db.insert(service).values(services)
	console.log('seeding users')
	await db.insert(user).values(users)
	console.log('seeding configurations')
	await db.insert(configuration).values(configurations)
	console.log('seeding clients')
	await db.insert(client).values(clients)
	console.log('seeding dailySchedules')
	await db.insert(dailySchedule).values(dailySchedules)
	console.log('seeding appointment')
	await db.insert(appointment).values(appointments)
}

seedLocalDb()
	.then(() => {
		console.log('DATABASE SEEDED ✅')
	})
	.catch((err) => {
		console.error('Error seeding local database:', err)
	})
	.finally(() => {
		pool.end()
	})
