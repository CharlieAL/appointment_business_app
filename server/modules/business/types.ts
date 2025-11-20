import type {
	Business,
	CreateBusinessInput,
	UpdateBusinessInput,
} from '~/server/db/schema/business'
import type { DalError } from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'

export interface BusinessDal {
	create(params: {
		business: CreateBusinessInput
		userId: string
	}): AsyncResult<Business, DalError>
	get(params: { id: string }): AsyncResult<Business, DalError>
	update(params: {
		id: string
		business: UpdateBusinessInput
	}): AsyncResult<Business, DalError>
}
