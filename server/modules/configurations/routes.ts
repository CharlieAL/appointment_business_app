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
	.get('/', async (c) => {
		const user = c.get('user')
		if (!user.business)
			throw new HTTPException(400, { message: 'User has no business assigned' })

		const { data, error } = await dal.getByBusiness({
			businessId: user.business,
		})
		if (error) {
			throw new HTTPException(error.code, {
				message: error.message,
				cause: error.cause,
			})
		}
		c.status(200)
		return c.json({ data })
	})
	.post(zValidator('json', createConfigurationsSchema), async (c) => {
		// todo: validate body, get user and then validete with business id and then create config
		const user = c.get('user')
		const body = c.req.valid('json')

		if (!user.business)
			throw new HTTPException(400, { message: 'User has no business assigned' })

		const { data, error } = await dal.create({
			businessId: user.business,
			config: body,
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
	// todo: is actaually needed to update config by id? when user has only one config by business
	.patch(':id', zValidator('json', updateConfigurationSchema), async (c) => {
		// todo get param id and body
		// validete if config exists and if business id matches the user business id
		const user = c.get('user')
		const { id } = c.req.param()
		const body = c.req.valid('json')

		if (!user.business) {
			throw new HTTPException(400, { message: 'User has no business assigned' })
		}

		const { data, error } = await dal.update({
			id,
			data: body,
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
	.get('/all', async (c) => {
		const user = c.get('user')

		if (!user.business)
			throw new HTTPException(400, { message: 'User has no business assigned' })

		const { data, error } = await dal.getAllByBusiness({
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
