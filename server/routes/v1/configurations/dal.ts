import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type { z } from 'zod'
import { db } from '~/server/db'
import {
	type Configuration,
	configuration as configModel,
	type createConfigurationsSchema,
	type updateConfigurationSchema,
} from '~/server/db/schema/configuration'

interface ConfigDal {
	create(params: {
		config: z.input<typeof createConfigurationsSchema>
		businessId: string
	}): Promise<Configuration>
	update(params: {
		id: string
		data: z.input<typeof updateConfigurationSchema>
	}): Promise<void>
}

export const dal = {
	create: async ({ businessId, config }) => {
		try {
			const [$config] = await db
				.insert(configModel)
				.values({
					...config,
					business: businessId,
				})
				.returning()

			return $config
		} catch (err) {
			throw new HTTPException(500, {
				message: 'Error creating business',
				cause: err,
			})
		}
	},
	update: async ({ id, data }) => {
		//todo validate if config exists
		//todo handle updatedAt field

		try {
			await db.update(configModel).set(data).where(eq(configModel.id, id))
		} catch (error) {
			console.error('Error updating configuration:', error)
			throw new HTTPException(500, { message: 'Error updating configuration' })
		}
	},
} as ConfigDal
