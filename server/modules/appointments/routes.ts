import { and, eq, gte } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { db } from '~/server/db'
import {
	appointment,
	createAppointmentSchema,
} from '~/server/db/schema/appointment'
import { zValidator } from '~/server/lib/validator-wrapper'
import { authMiddleware } from '~/server/middlewares/auth.middleware'
import type { HonoEnv } from '~/server/types'
import { dal } from './dal'

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

  //TODO: validete no create appointment in the past, 
  //no appointment with the same worker at the same time,
*/

const app = new Hono<HonoEnv>()
	.use(authMiddleware)
	.get(async (c) => {
		// get user from auth middleware
		// get business id from user
		// todo get appointments from db
		// get first 10 appointments by date

		let data = []

		const $date = c.req.query('date')
		const user = c.get('user')
		if (!user.business) {
			c.status(400)
			return c.json({ message: 'User has no business assigned' })
		}

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
			where: and(eq(appointment.business, user.business)),
			limit: 10,
		})
		console.log('Date query param:', date)

		c.status(201)
		return c.json({ data })
	})
	.post(zValidator('json', createAppointmentSchema), async (c) => {
		const body = c.req.valid('json')
		const user = c.get('user')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}

		const { data, error } = await dal.create({
			appointment: body,
			worker: user.id,
			business: user.business,
		})

		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}

		return c.json({ data }, 201)
	})

export { app }
