import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { createClientSchema } from '~/server/db/schema/client'
import { zValidator } from '~/server/lib/validator-wrapper'
import { authMiddleware } from '~/server/middlewares/auth.middleware'
import type { HonoEnv } from '~/server/types'
import { dal } from './dal'

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
	.post(zValidator('json', createClientSchema), async (c) => {
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
		return c.json({
			data,
		})
	})
	.patch(':id', zValidator('json', createClientSchema.partial()), async (c) => {
		const body = c.req.valid('json')
		const user = c.get('user')
		const clientId = c.req.param('id')

		if (!user.business) {
			throw new HTTPException(400, {
				message: 'User has no business assigned',
			})
		}

		const { data, error } = await dal.updateById({ clientId, data: body })
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
		const clientId = c.req.param('id')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}
		const { error } = await dal.deleteById({ clientId })
		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}
		c.status(200)
		return c.json({ message: 'Client deleted successfully' })
	})
