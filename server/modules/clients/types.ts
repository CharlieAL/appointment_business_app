import type {
	Client,
	CreateClientInput,
	UpdateClientInput,
} from '~/server/db/schema/client'
import type { DalError } from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'

export interface DalClient {
	create(params: {
		data: CreateClientInput
		businessId: string
	}): AsyncResult<Client, DalError>
	getByBusiness(params: { businessId: string }): AsyncResult<Client[], DalError>
	deleteById(params: { clientId: string }): AsyncResult<void, DalError>
	updateById(params: {
		clientId: string
		data: UpdateClientInput
	}): AsyncResult<Client, DalError>
	getById(params: { clientId: string }): AsyncResult<Client, DalError>
}
