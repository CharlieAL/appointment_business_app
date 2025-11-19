import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type { z } from 'zod'
import { db } from '~/server/db'
import {
	type createServiceSchema,
	type Service,
	service as serviceModule,
} from '~/server/db/schema/service'

interface DalService {
	create(params: {
		data: z.infer<typeof createServiceSchema>
		businessId: string
	}): Promise<Service>
	getByBusiness(params: { businessId: string }): Promise<Service[]>
	deleteById(params: { serviceId: string }): Promise<void>
	updateById(params: {
		serviceId: string
		data: Partial<z.infer<typeof createServiceSchema>>
	}): Promise<void>
	getById(params: { serviceId: string }): Promise<Service | null>
}

export const dal: DalService = {
	async getById(params) {
		const [service] = await db
			.select()
			.from(serviceModule)
			.where(eq(serviceModule.id, params.serviceId))
		return service
	},
	async updateById(params) {
		// todo validate if service exists before update
		const serviceExists = await this.getById({ serviceId: params.serviceId })
		if (!serviceExists)
			throw new HTTPException(404, { message: 'Service not found' })
		try {
			await db
				.update(serviceModule)
				.set({
					...params.data,
				})
				.where(eq(serviceModule.id, params.serviceId))
		} catch (error) {
			throw new HTTPException(500, {
				message: 'Error updating service',
				cause: error,
			})
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

			if (!$service) {
				throw new HTTPException(500, {
					message: 'Service could not be created',
				})
			}
			return $service
		} catch (error) {
			throw new HTTPException(500, {
				message: 'Error service',
				cause: error,
			})
		}
	},
	async getByBusiness(params) {
		const services = await db
			.select()
			.from(serviceModule)
			.where(eq(serviceModule.business, params.businessId))
		if (services.length < 1) {
			throw new HTTPException(404, {
				message: 'No services found for this business',
			})
		}
		return services
	},
	async deleteById(params) {
		// todo validate if service exists before delete
		try {
			await db
				.delete(serviceModule)
				.where(eq(serviceModule.id, params.serviceId))
		} catch (error) {
			throw new HTTPException(500, {
				message: 'Error deleting service',
				cause: error,
			})
		}
	},
}
