import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import {
	type CreateServiceSchemaInput,
	type Service,
	service as serviceModule,
	type UpdateServiceSchemaInput,
} from '~/server/db/schema/service'
import {
	type DalError,
	DatabaseError,
	NotFoundError,
} from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'
import { failure, success } from '~/server/types'

interface DalService {
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

export const dal: DalService = {
	async getById(params) {
		try {
			const [service] = await db
				.select()
				.from(serviceModule)
				.where(eq(serviceModule.id, params.serviceId))

			if (!service)
				return failure(new NotFoundError('Service', params.serviceId))
			return success(service)
		} catch (error) {
			return failure(new DatabaseError('Error getting service by id', error))
		}
	},
	async updateById(params) {
		// todo validate if service exists before update
		const { data: serviceExists, error } = await this.getById({
			serviceId: params.serviceId,
		})
		if (error) return failure(error)
		try {
			const [$service] = await db
				.update(serviceModule)
				.set({
					...params.data,
				})
				.where(eq(serviceModule.id, serviceExists.id))
				.returning()

			return success($service)
		} catch (error) {
			return failure(new DatabaseError('Error updating service', error))
		}
	},
	async create(params) {
		// we need validate something here????
		try {
			const [$service] = await db
				.insert(serviceModule)
				.values({
					...params.data,
					business: params.businessId,
				})
				.returning()

			return success($service)
		} catch (error) {
			return failure(new DatabaseError('Error creating service', error))
		}
	},
	async getByBusiness(params) {
		try {
			const services = await db
				.select()
				.from(serviceModule)
				.where(eq(serviceModule.business, params.businessId))

			return success(services)
		} catch (error) {
			return failure(
				new DatabaseError('Error getting services by business', error)
			)
		}
	},
	async deleteById(params) {
		try {
			const { data, error } = await this.getById({
				serviceId: params.serviceId,
			})

			if (error) return failure(error)

			await db.delete(serviceModule).where(eq(serviceModule.id, data.id))

			return success(undefined)
		} catch (error) {
			return failure(new DatabaseError('Error deleting service', error))
		}
	},
}
