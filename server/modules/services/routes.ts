import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import {
	createServiceSchema,
	updateServiceSchema,
} from '~/server/db/schema/service'
import { zValidator } from '~/server/lib/validator-wrapper'
import { authMiddleware } from '~/server/middlewares/auth.middleware'
import type { HonoEnv } from '~/server/types'
import { dal } from './dal'
// todo add patch to update service: one by one or multiple??????
// todo create multiple services at once???? or by one only
export const app = new Hono<HonoEnv>()
	.use(authMiddleware)
	.get(async (c) => {
		const user = c.get('user')
		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}

		const { data, error } = await dal.getByBusiness({
			businessId: user.business,
		})

		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}
		return c.json({ data })
	})
	.post(zValidator('json', createServiceSchema), async (c) => {
		const body = c.req.valid('json')
		const user = c.get('user')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}

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
	})
	.patch(':id', zValidator('json', updateServiceSchema), async (c) => {
		const body = c.req.valid('json')
		const user = c.get('user')
		const serviceId = c.req.param('id')

		if (!user.business) {
			throw new HTTPException(400, {
				message: 'User has no business assigned',
			})
		}

		const { data, error } = await dal.updateById({ serviceId, data: body })
		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}
		c.status(200)
		return c.json({ data })
	})
	.delete(':id', async (c) => {
		const user = c.get('user')
		const serviceId = c.req.param('id')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}
		const { error } = await dal.deleteById({ serviceId })

		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}

		c.status(200)
		return c.json({ message: 'Service deleted successfully' })
	})
