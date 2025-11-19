import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { createBusinessSchema } from '~/server/db/schema/business'
import { zValidator } from '~/server/lib/validator-wrapper'
import { authMiddleware } from '~/server/middlewares/auth.middleware'
import type { HonoEnv } from '~/server/types'

import { dal } from './dal'
// Should I create the delete business route?
export const app = new Hono<HonoEnv>()
	.use(authMiddleware)
	.get(async (c) => {
		const user = c.get('user')

		if (!user.business) {
			throw new HTTPException(404, {
				message: 'User has no business',
			})
		}

		const { data, error } = await dal.get({ id: user.business })

		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}

		if (!data) {
			throw new HTTPException(404, {
				message: 'Business not found',
			})
		}

		return c.json({
			business: data,
		})
	})
	.post(zValidator('json', createBusinessSchema), async (c) => {
		const businessData = c.req.valid('json')

		const user = c.get('user')

		if (user.role !== 'owner') {
			throw new HTTPException(403, {
				message: 'Only users with owner role can create a business',
			})
		}

		if (user.business) {
			throw new HTTPException(400, {
				message: 'User already has a business',
			})
		}

		const { data, error } = await dal.create({
			business: businessData,
			userId: user.id,
		})

		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}

		c.status(201)
		return c.json({
			business: data,
		})
	})
	.patch(zValidator('json', createBusinessSchema.partial()), async (c) => {
		const businessData = c.req.valid('json')
		const user = c.get('user')

		if (user.role !== 'owner') {
			throw new HTTPException(403, {
				message: 'Only users with owner role can create a business',
			})
		}

		if (!user.business) {
			throw new HTTPException(404, {
				message: 'User has no business to update',
			})
		}

		const { data, error } = await dal.update({
			id: user.business,
			business: businessData,
		})

		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}

		return c.json({
			business: data,
		})
	})
