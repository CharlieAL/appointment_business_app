import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import {
	type CreateDailySchedule,
	type DailySchedule,
	dailySchedule as dailyScheduleModel,
	type UpdateDailySchedule,
} from '~/server/db/schema/daily-schedule'
import { DatabaseError, ValidationError } from '~/server/errors/dal-error'
import { failure, success } from '~/server/types'
import type { DailyScheduleDal } from './types'

export const dal: DailyScheduleDal = {
	async getCreated(params) {
		let validateData: UpdateDailySchedule[] = []

		const { data, error } = await this.getByBusiness({
			bussinessId: params.businesId,
		})
		if (error) return failure(error)

		const ds = data.map((d) => ({ day: d.dayWeek }))

		if (ds.length > 0) {
			const days = ds.flatMap((d) => d.day)
			validateData = params.data.filter((d) => {
				return days.includes(d.dayWeek)
			})
		}

		if (validateData.length === 0)
			return failure(new ValidationError('No daily schedules found to update'))

		return success(validateData)
	},
	async getUncreated(params) {
		let validateData: CreateDailySchedule[] = []

		const { data, error } = await this.getByBusiness({
			bussinessId: params.businesId,
		})
		if (error) return failure(error)
		const ds = data.map((d) => ({ day: d.dayWeek }))

		if (ds.length > 0) {
			const days = ds.flatMap((d) => d.day)
			validateData = params.data.filter((d) => !days.includes(d.dayWeek))
		} else {
			validateData = params.data
		}

		if (validateData.length === 0)
			return failure(
				new ValidationError('All provided daily schedules already exist')
			)

		return success(validateData)
	},
	async create(params) {
		// validar que los dias sean unicos por negocio

		const { data: validateData, error } = await this.getUncreated({
			data: params.data,
			businesId: params.businessId,
		})

		if (error) return failure(error)

		const data = validateData.map((d) => ({
			...d,
			business: params.businessId,
		}))

		try {
			const $ds = await db.insert(dailyScheduleModel).values(data).returning()
			return success($ds)
		} catch (error) {
			return failure(
				new DatabaseError('Failed to create daily schedules', error)
			)
		}
	},
	async getByBusiness(params) {
		try {
			const ds = await db
				.select()
				.from(dailyScheduleModel)
				.where(eq(dailyScheduleModel.business, params.bussinessId))

			return success(ds)
		} catch (error) {
			return failure(
				new DatabaseError('Failed to retrieve daily schedules', error)
			)
		}
	},
	async update(params) {
		//todo get each ds and update one by one
		//before that validate if the dayWeek already exists
		//

		const { data: validateData, error } = await this.getCreated({
			businesId: params.businesId,
			data: params.data,
		})
		if (error) return failure(error)
		try {
			const ds: DailySchedule[] = []
			for (const d of validateData) {
				const [$ds] = await db
					.update(dailyScheduleModel)
					.set({
						openingTime: d.openingTime,
						closingTime: d.closingTime,
					})
					.where(eq(dailyScheduleModel.dayWeek, d.dayWeek))
					.returning()
				ds.push($ds)
			}
			return success(ds)
		} catch (error) {
			return failure(
				new DatabaseError('Failed to update daily schedules', error)
			)
		}
	},
}
