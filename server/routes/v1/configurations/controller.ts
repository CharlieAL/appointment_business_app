import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import {
	createConfigurationsSchema,
	updateConfigurationSchema,
} from '~/server/db/schema/configuration'
import { zValidator } from '~/server/lib/validator-wrapper'
import { authMiddleware } from '~/server/middlewares/auth.middleware'
import type { HonoEnv } from '~/server/types'
import { dal } from './dal'
export const app = new Hono<HonoEnv>()
	.use(authMiddleware)
	.post('/', zValidator('json', createConfigurationsSchema), async (c) => {
		// todo: validate body, get user and then validete with business id and then create config
		const user = c.get('user')
		const body = c.req.valid('json')

		if (!user.business)
			throw new HTTPException(400, { message: 'User has no business assigned' })

		const config = await dal.create({ businessId: user.business, config: body })

		c.status(201)
		return c.json({
			message: 'Configuration created successfully',
			config,
		})
	})
	.patch('/:id', zValidator('json', updateConfigurationSchema), async (c) => {
		// todo get param id and body
		// validete if config exists and if business id matches the user business id
		const user = c.get('user')
		const { id } = c.req.param()
		const body = c.req.valid('json')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}
		if (user.role !== 'owner')
			throw new HTTPException(403, {
				message: 'Only owners can update configurations',
			})

		if (user.business !== body.business)
			throw new HTTPException(403, {
				message: 'You can only update configurations for your own business',
			})

		await dal.update({ id, data: body })

		return c.json({ message: 'Configuration updated successfully' })
	})
