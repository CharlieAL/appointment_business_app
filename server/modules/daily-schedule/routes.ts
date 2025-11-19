import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import {
	createDailyScheduleSchema,
	updateDailyScheduleSchema,
} from '~/server/db/schema/daily-schedule'
import { zValidator } from '~/server/lib/validator-wrapper'
import { authMiddleware } from '~/server/middlewares/auth.middleware'
import type { HonoEnv } from '~/server/types'
import { dal } from './dal'

//TODO: implement delete route

export const app = new Hono<HonoEnv>()
	.use(authMiddleware)
	.get(async (c) => {
		const user = c.get('user')

		if (!user.business)
			throw new HTTPException(400, { message: 'User has no business assigned' })

		const { data, error } = await dal.getByBusiness({
			bussinessId: user.business,
		})
		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}
		return c.json({ data })
	})
	.post(
		zValidator('json', z.array(z.object(createDailyScheduleSchema.shape))),
		async (c) => {
			// todo: implement daily schedule logic
			// get user from auth middleware
			// get business id from user
			// get array of the body

			const body = c.req.valid('json')
			const user = c.get('user')

			if (!user.business) {
				throw new HTTPException(400, {
					message: 'User has no business assigned',
				})
			}
			if (body.length < 1)
				throw new HTTPException(400, { message: 'Body cannot be empty' })

			const { data, error } = await dal.create({
				data: body,
				businessId: user.business,
			})
			if (error) {
				throw new HTTPException(error.code, {
					message: error.message,
					cause: error.cause,
				})
			}

			c.status(201)
			return c.json({ data })
		}
	)
	.patch(
		zValidator('json', z.array(z.object(updateDailyScheduleSchema.shape))),
		async (c) => {
			const body = c.req.valid('json')
			const user = c.get('user')

			console.log('PATCH /daily-schedule body:', body)

			if (!user.business) {
				throw new HTTPException(400, {
					message: 'User has no business assigned',
				})
			}
			if (body.length < 1)
				throw new HTTPException(400, { message: 'Body cannot be empty' })

			const { data, error } = await dal.update({
				data: body,
				id: user.id,
				businesId: user.business,
			})
			if (error) {
				throw new HTTPException(error.code, {
					message: error.message,
					cause: error.cause,
				})
			}

			c.status(201)
			return c.json({ data })
		}
	)
