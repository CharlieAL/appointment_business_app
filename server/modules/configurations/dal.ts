import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { configuration as configModel } from '~/server/db/schema/configuration'
import {
	DatabaseError,
	NotFoundError,
	ValidationError,
} from '~/server/errors/dal-error'
import { failure, success } from '~/server/types'
import { dal as dalDs } from '../daily-schedule/dal'
import type { ConfigDal } from './types'

export const dal: ConfigDal = {
	async create({ businessId, config }) {
		const { data } = await this.getByBusiness({ businessId })

		if (data)
			return failure(
				new ValidationError('Configuration already exists for business')
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
			if (!$config) return failure(new NotFoundError('Configuration'))
			return success($config)
		} catch (error) {
			return failure(
				new DatabaseError('Error getting configuration by business', error)
			)
		}
	},
	async getAllByBusiness({ businessId }) {
		const { data: ds, error: errorDs } = await dalDs.getByBusiness({
			bussinessId: businessId,
		})
		if (errorDs) return failure(errorDs)
		const { data, error } = await this.getByBusiness({ businessId })
		if (error) return failure(error)

		return success({
			dailySchedule: ds,
			configuration: data,
		})
	},
}
