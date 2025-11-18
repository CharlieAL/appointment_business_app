import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { createServiceSchema } from '~/server/db/schema/service'
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

		const services = await dal.getByBusiness({ businessId: user.business })
		return c.json({ services })
	})
	.post(zValidator('json', createServiceSchema), async (c) => {
		const body = c.req.valid('json')
		const user = c.get('user')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}

		const service = await dal.create({ data: body, businessId: user.business })

		c.status(201)
		return c.json({ message: 'Service created successfully', service })
	})
	.patch(
		':id',
		zValidator('json', createServiceSchema.partial()),
		async (c) => {
			const body = c.req.valid('json')
			const user = c.get('user')
			const serviceId = c.req.param('id')

			if (!user.business) {
				throw new HTTPException(400, {
					message: 'User has no business assigned',
				})
			}

			await dal.updateById({ serviceId, data: body })
			c.status(200)
			return c.json({ message: 'Service updated successfully' })
		}
	)
	.delete(':id', async (c) => {
		const user = c.get('user')
		const serviceId = c.req.param('id')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}
		await dal.deleteById({ serviceId })

		c.status(200)
		return c.json({ message: 'Service deleted successfully' })
	})
