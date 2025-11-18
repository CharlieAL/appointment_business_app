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

		const clients = await dal.getByBusiness({ businessId: user.business })
		return c.json({ clients })
	})
	.post(zValidator('json', createClientSchema), async (c) => {
		const body = c.req.valid('json')
		const user = c.get('user')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}

		const client = await dal.create({ data: body, businessId: user.business })

		c.status(201)
		return c.json({ message: 'Client created successfully', client })
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

		await dal.updateById({ clientId, data: body })
		c.status(200)
		return c.json({ message: 'Client updated successfully' })
	})
	.delete(':id', async (c) => {
		const user = c.get('user')
		const clientId = c.req.param('id')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}
		await dal.deleteById({ clientId })

		c.status(200)
		return c.json({ message: 'Client deleted successfully' })
	})
