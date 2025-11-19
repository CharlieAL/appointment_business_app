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

		const { data, err } = await dal.get({ id: user.business })

		if (err) {
			throw new HTTPException(err?.code ?? 500, {
				message: err.message,
				cause: err.cause,
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

		const business = await dal.create({
			business: businessData,
			userId: user.id,
		})

		c.status(201)
		return c.json({
			message: 'Business created and user updated',
			business: business,
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

		await dal.update({
			id: user.business,
			business: businessData,
		})

		return c.json({
			message: 'Business updated successfully',
		})
	})
