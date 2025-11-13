import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth'
import { business, createBusinessSchema } from '~/server/db/schema/business'
import { authMiddleware } from '~/server/middlewares/auth.middleware'
import type { HonoEnv } from '~/server/types'

const app = new Hono<HonoEnv>()
	.use(authMiddleware)
	.post('/', zValidator('json', createBusinessSchema), async (c) => {
		// todo business create logic
		// get user from auth middleware
		// check if user has business
		// if not, create business
		// and associate to user
		// return business id
		const businessData = c.req.valid('json')

		const $user = c.get('user')

		if ($user.business) {
			return c.json({ message: 'User already has a business' }, 400)
		}

		const [$business] = await db
			.insert(business)
			.values(businessData)
			.returning()

		await db
			.update(user)
			.set({ business: $business.id })
			.where(eq(user.id, $user.id))

		c.status(201)
		return c.json({
			message: 'Business created and user updated',
			business: $business,
		})
	})

export { app }
