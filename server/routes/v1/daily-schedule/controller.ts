import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import { createDailyScheduleSchema } from '~/server/db/schema/daily-schedule'
import { zValidator } from '~/server/lib/validator-wrapper'
import { authMiddleware } from '~/server/middlewares/auth.middleware'
import type { HonoEnv } from '~/server/types'
import { dal } from './dal'

export const app = new Hono<HonoEnv>()
	.use(authMiddleware)
	.post(
		'/',
		zValidator('json', z.array(z.object(createDailyScheduleSchema.shape))),
		async (c) => {
			// todo: implement daily schedule logic
			// get user from auth middleware
			// get business id from user
			// get array of the body

			const body = c.req.valid('json')
			const user = c.get('user')

			if (user.business === null || user.business === undefined) {
				throw new HTTPException(400, {
					message: 'User has no business assigned',
				})
			}
			if (body.length < 1)
				throw new HTTPException(400, { message: 'Body cannot be empty' })

			await dal.create({ data: body, businessId: user.business })

			c.status(201)
			return c.json({ message: 'created succesfully' })
		}
	)
