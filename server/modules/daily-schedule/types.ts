import type {
	CreateDailySchedule,
	DailySchedule,
	UpdateDailySchedule,
} from '~/server/db/schema/daily-schedule'
import type { DalError } from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'

export interface DailyScheduleDal {
	create(params: {
		data: CreateDailySchedule[]
		businessId: string
	}): AsyncResult<DailySchedule[], DalError>
	getByBusiness(params: {
		bussinessId: string
	}): AsyncResult<DailySchedule[], DalError>
	update(params: {
		data: UpdateDailySchedule[]
		id: string
		businesId: string
	}): AsyncResult<DailySchedule[], DalError>
	getUncreated(params: {
		data: CreateDailySchedule[]
		businesId: string
	}): AsyncResult<CreateDailySchedule[], DalError>
	getCreated(params: {
		data: UpdateDailySchedule[]
		businesId: string
	}): AsyncResult<UpdateDailySchedule[], DalError>
}
