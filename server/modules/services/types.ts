import type {
	CreateServiceSchemaInput,
	Service,
	UpdateServiceSchemaInput,
} from '~/server/db/schema/service'
import type { DalError } from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'

export interface DalService {
	create(params: {
		data: CreateServiceSchemaInput
		businessId: string
	}): AsyncResult<Service, DalError>
	getByBusiness(params: {
		businessId: string
	}): AsyncResult<Service[], DalError>
	deleteById(params: { serviceId: string }): AsyncResult<void, DalError>
	updateById(params: {
		serviceId: string
		data: UpdateServiceSchemaInput
	}): AsyncResult<Service, DalError>
	getById(params: { serviceId: string }): AsyncResult<Service, DalError>
}
