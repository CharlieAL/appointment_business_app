import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type { z } from 'zod'
import { db } from '~/server/db'
import {
	type createDailyScheduleSchema,
	type DailySchedule,
	dailySchedule as dailyScheduleModel,
} from '~/server/db/schema/daily-schedule'

interface DailyScheduleDal {
	create(params: {
		data: Array<z.infer<typeof createDailyScheduleSchema>>
		businessId: string
	}): Promise<void>
	get(params: { bussinessId: string }): Promise<DailySchedule[]>
}
export const dal = {
	async create(params) {
		// validar que los dias sean unicos por negocio
		//

		let validateData: Array<z.infer<typeof createDailyScheduleSchema>> = []

		const ds = (await this.get({ bussinessId: params.businessId })).map(
			(d) => ({ day: d.dayWeek })
		)
		if (ds.length > 0) {
			const days = ds.flatMap((d) => d.day)
			validateData = params.data.filter((d) => !days.includes(d.dayWeek))
		}

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
			throw new HTTPException(500, { message: 'Error creating daily schedule' })
		}
	},
	async get(params) {
		const ds = await db
			.select()
			.from(dailyScheduleModel)
			.where(eq(dailyScheduleModel.business, params.bussinessId))
		if (ds.length < 1) {
			throw new HTTPException(404, {
				message: 'No daily schedule found for this business',
			})
		}

		return ds
	},
} as DailyScheduleDal
