import { gte } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '~/server/db'
import { appointment } from '~/server/db/schema/appointment'

/*
  TODO: get appointments for a business by date range by status by client. and inner join services, client info 
  GET /appointments?startDate=2024-12-01&endDate=2024-12-31&status=pending&clientId=uuid
  
  TODO: post new appointment and insert services in appointmentServices table
  POST /appointments

  TODO: update appointment
  PATCH /appointments/:id

  TODO: dashboard endpoint return {
    total,
    pending,
    completed,
    earningsOfDay,
    dates: status, service, client
  }
        -
*/

const app = new Hono().get(async (c) => {
	// get user from auth middleware
	// get business id from user
	// todo get appointments from db
	// get first 10 appointments by date

	let data = []

	const $date = c.req.query('date')

	const date = $date ? new Date($date) : new Date()

	data = await db.query.appointment.findMany({
		with: {
			client: {
				columns: {
					name: true,
				},
			},
			services: {
				columns: {
					service: true,
				},
			},
		},
		where: gte(appointment.date, date),
		limit: 10,
	})
	console.log('Date query param:', date)

	console.log(data)
	c.status(201)
	return c.json('appointment app works!')
})

export { app }
