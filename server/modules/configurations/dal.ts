import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import {
	type Configuration,
	type CreateConfigurationInput,
	configuration as configModel,
	type UpdateConfigurationInput,
} from '~/server/db/schema/configuration'
import type { DailySchedule } from '~/server/db/schema/daily-schedule'
import {
	type DalError,
	DatabaseError,
	NotFoundError,
	ValidationError,
} from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'
import { failure, success } from '~/server/types'
import { dal as dalDs } from '../daily-schedule/dal'

type getAllByBusinessResponse = {
	configuration: Configuration | null
	dailySchedule: DailySchedule[]
}
interface ConfigDal {
	create(params: {
		config: CreateConfigurationInput
		businessId: string
	}): AsyncResult<Configuration, DalError>
	update(params: {
		id: string
		data: UpdateConfigurationInput
		businessId: string
	}): AsyncResult<Configuration, DalError>
	getById(params: { id: string }): AsyncResult<Configuration, DalError>
	getByBusiness(params: {
		businessId: string
	}): AsyncResult<Configuration, DalError>
	getAllByBusiness(params: {
		businessId: string
	}): AsyncResult<getAllByBusinessResponse, DalError>
}

export const dal: ConfigDal = {
	async create({ businessId, config }) {
		const existedConfig = await this.getByBusiness({ businessId })

		if (existedConfig)
			return failure(
				new ValidationError('Configuration for this business already exists')
			)

		try {
			const [$config] = await db
				.insert(configModel)
				.values({
					...config,
					business: businessId,
				})
				.returning()

			return success($config)
		} catch (err) {
			return failure(new DatabaseError('Error creating configuration', err))
		}
	},
	async update({ id, data, businessId }) {
		const { data: config, error } = await this.getById({ id })
		if (error) return failure(error)

		if (businessId !== config.business)
			return failure(
				new ValidationError('Configuration does not belong to the business')
			)
		try {
			const [$update] = await db
				.update(configModel)
				.set(data)
				.where(eq(configModel.id, id))
				.returning()
			return success($update)
		} catch (error) {
			return failure(new DatabaseError('Error updating configuration', error))
		}
	},
	async getById({ id }) {
		try {
			const [config] = await db
				.select()
				.from(configModel)
				.where(eq(configModel.id, id))
				.limit(1)
			if (!config) return failure(new NotFoundError('Configuration', id))
			return success(config)
		} catch (error) {
			return failure(
				new DatabaseError('Error getting configuration by id', error)
			)
		}
	},
	async getByBusiness({ businessId }) {
		try {
			const [$config] = await db
				.select()
				.from(configModel)
				.where(eq(configModel.business, businessId))
				.limit(1)
			if (!$config)
				return failure(new NotFoundError('Configuration for business'))
			return success($config)
		} catch (error) {
			return failure(
				new DatabaseError('Error getting configuration by business', error)
			)
		}
	},
	async getAllByBusiness({ businessId }) {
		//TODO: this not working when i change dal in daily-schedule to class
		const ds = await dalDs.getByBusiness({ bussinessId: businessId })
		const { data, error } = await this.getByBusiness({ businessId })
		if (error) return failure(error)

		return success({
			dailySchedule: ds,
			configuration: data,
		})
	},
}
