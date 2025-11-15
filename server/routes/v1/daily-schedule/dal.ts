import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type { z } from 'zod'
import { db } from '~/server/db'
import {
	type createDailyScheduleSchema,
	type DailySchedule,
	dailySchedule as dailyScheduleModel,
	type updateDailyScheduleSchema,
} from '~/server/db/schema/daily-schedule'

interface DailyScheduleDal {
	create(params: {
		data: Array<z.infer<typeof createDailyScheduleSchema>>
		businessId: string
	}): Promise<void>
	getByBusiness(params: { bussinessId: string }): Promise<DailySchedule[]>
	update(params: {
		data: Array<z.infer<typeof updateDailyScheduleSchema>>
		id: string
		businesId: string
	}): Promise<void>
	getUncreated(params: {
		data: Array<z.infer<typeof createDailyScheduleSchema>>
		businesId: string
	}): Promise<Array<z.infer<typeof createDailyScheduleSchema>> | []>
	getCreated(params: {
		data: Array<z.infer<typeof updateDailyScheduleSchema>>
		businesId: string
	}): Promise<Array<z.infer<typeof updateDailyScheduleSchema>> | []>
}
export const dal = {
	async getCreated(params) {
		let validateData: Array<z.infer<typeof updateDailyScheduleSchema>> = []
		const ds = (
			await this.getByBusiness({ bussinessId: params.businesId })
		).map((d) => ({ day: d.dayWeek }))

		if (ds.length > 0) {
			const days = ds.flatMap((d) => d.day)
			validateData = params.data.filter((d) => {
				return days.includes(d.dayWeek)
			})
		}

		return validateData
	},
	async getUncreated(
		params
	): Promise<Array<z.infer<typeof createDailyScheduleSchema>>> {
		let validateData: Array<z.infer<typeof createDailyScheduleSchema>> = []

		const ds = (
			await this.getByBusiness({ bussinessId: params.businesId })
		).map((d) => ({ day: d.dayWeek }))

		if (ds.length > 0) {
			const days = ds.flatMap((d) => d.day)
			validateData = params.data.filter((d) => !days.includes(d.dayWeek))
		} else {
			validateData = params.data
		}
		return validateData
	},
	async create(params) {
		// validar que los dias sean unicos por negocio
		//

		const validateData = await this.getUncreated({
			data: params.data,
			businesId: params.businessId,
		})

		if (validateData.length === 0) {
			throw new HTTPException(400, {
				message: 'Daily schedule for this business already exists',
			})
		}

		const data = validateData.map((d) => ({
			...d,
			business: params.businessId,
		}))

		try {
			await db.insert(dailyScheduleModel).values(data)
		} catch (error) {
			throw new HTTPException(500, {
				message: 'Error creating daily schedule',
				cause: error,
			})
		}
	},
	async getByBusiness(params) {
		const ds = await db
			.select()
			.from(dailyScheduleModel)
			.where(eq(dailyScheduleModel.business, params.bussinessId))

		return ds
	},
	async update(params) {
		//todo get each ds and update one by one
		//before that validate if the dayWeek already exists
		//

		const validateData = await this.getCreated({
			businesId: params.businesId,
			data: params.data,
		})
		if (validateData.length === 0)
			throw new HTTPException(400, {
				message: 'No daily schedule found to update',
			})

		for (const d of validateData) {
			await db
				.update(dailyScheduleModel)
				.set({
					openingTime: d.openingTime,
					closingTime: d.closingTime,
				})
				.where(eq(dailyScheduleModel.dayWeek, d.dayWeek))
		}
		return
	},
} as DailyScheduleDal
