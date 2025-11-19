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
import type { DailySchedule } from '~/server/db/schema/daily-schedule'
import { dal as dalDs } from '../daily-schedule/dal'

type getAllByBusinessResponse = {
	configuration: Configuration | null
	dailySchedule: DailySchedule[]
}
interface ConfigDal {
	create(params: {
		config: z.input<typeof createConfigurationsSchema>
		businessId: string
	}): Promise<Configuration>
	update(params: {
		id: string
		data: z.input<typeof updateConfigurationSchema>
		businessId: string
	}): Promise<void>
	getById(params: { id: string }): Promise<Configuration | null>
	getByBusiness(params: { businessId: string }): Promise<Configuration | null>
	getAllByBusiness(params: {
		businessId: string
	}): Promise<getAllByBusinessResponse>
}

export const dal: ConfigDal = {
	async create({ businessId, config }) {
		//todo validate if config for business already exists
		const existedConfig = await this.getByBusiness({ businessId })

		if (existedConfig)
			throw new HTTPException(400, {
				message: 'Configuration for this business already exists',
			})

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
				message: 'Error creating configuration',
				cause: err,
			})
		}
	},
	async update({ id, data, businessId }) {
		//todo validate if config exists
		//todo handle updatedAt field
		//todo is nescessary update by id, if business is unique?
		const config = await this.getById({ id })
		if (!config)
			throw new HTTPException(404, { message: 'Configuration not found' })

		if (businessId !== config.business)
			throw new HTTPException(403, {
				message: 'You can only update configurations for your own business',
			})

		try {
			await db.update(configModel).set(data).where(eq(configModel.id, id))
		} catch (error) {
			console.error('Error updating configuration:', error)
			throw new HTTPException(500, { message: 'Error updating configuration' })
		}
	},
	async getById({ id }) {
		const [config] = await db
			.select()
			.from(configModel)
			.where(eq(configModel.id, id))
			.limit(1)
		if (!config) return null
		return config
	},
	async getByBusiness({ businessId }) {
		const [$config] = await db
			.select()
			.from(configModel)
			.where(eq(configModel.business, businessId))
			.limit(1)
		if (!$config) return null
		return $config
	},
	async getAllByBusiness({ businessId }) {
		const ds = await dalDs.getByBusiness({ bussinessId: businessId })
		const config = await this.getByBusiness({ businessId })

		return {
			dailySchedule: ds,
			configuration: config,
		}
	},
}
