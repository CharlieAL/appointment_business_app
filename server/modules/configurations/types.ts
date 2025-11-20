import type {
	Configuration,
	CreateConfigurationInput,
	UpdateConfigurationInput,
} from '~/server/db/schema/configuration'
import type { DailySchedule } from '~/server/db/schema/daily-schedule'
import type { DalError } from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'

type getAllByBusinessResponse = {
	configuration: Configuration | null
	dailySchedule: DailySchedule[]
}
export interface ConfigDal {
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
