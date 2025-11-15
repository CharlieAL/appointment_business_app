import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '~/server/db'
import { appointment } from '~/server/db/schema/appointment'

const app = new Hono().get('/', async (c) => {
	// get user from auth middleware
	// get business id from user
	// todo get appointments from db
	// get first 10 appointments by date

	let data = []

	const $date = c.req.query('date')

	const date = $date ? new Date($date) : null

	data = date
		? await db.select().from(appointment).where(eq(appointment.date, date))
		: await db.select().from(appointment)

	console.log('Date query param:', date)

	console.log(data)
	c.status(201)
	return c.json('appointment app works!')
})

export { app }
