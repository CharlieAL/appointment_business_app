import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import {
	createAppointmentSchema,
	updateAppointmentSchema,
} from '~/server/db/schema/appointment'
import { zValidator } from '~/server/lib/validator-wrapper'
import { authMiddleware } from '~/server/middlewares/auth.middleware'
import type { HonoEnv } from '~/server/types'
import { dal } from './dal'
import { appointmentFiltersSchema } from './types'

/*
  TODO: get appointments with details
  GET /appointments?details=true i dont know if this work with trp!!!!!!!!!!!!!
*/

const app = new Hono<HonoEnv>()
	.use(authMiddleware)
	.get(zValidator('query', appointmentFiltersSchema), async (c) => {
		const filters = c.req.valid('query')

		const user = c.get('user')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}

		const { data, error } = await dal.get({
			filters,
			business: user.business,
		})

		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}

		return c.json({ data })
	})
	.post(zValidator('json', createAppointmentSchema), async (c) => {
		const body = c.req.valid('json')
		const user = c.get('user')
        const now = new Date()

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}

		const { data, error } = await dal.create({
			appointment: body,
			worker: user.id,
			business: user.business,
            now,
		})

		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}

		return c.json({ data }, 201)
	})
	.patch(':id', zValidator('json', updateAppointmentSchema), async (c) => {

		const body = c.req.valid('json')
        const { id } = c.req.param()
        const user = c.get('user')
        const now = new Date()

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}

		const { data, error } = await dal.update({
			data: body,
			id,
			business: user.business,
            now,
		})

		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}

		return c.json({ data })
	})

export { app }
