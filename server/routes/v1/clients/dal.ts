import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type { z } from 'zod'
import { db } from '~/server/db'
import {
	type Client,
	client as clientModule,
	type createClientSchema,
} from '~/server/db/schema/client'

interface DalClient {
	create(params: {
		data: z.infer<typeof createClientSchema>
		businessId: string
	}): Promise<Client>
	getByBusiness(params: { businessId: string }): Promise<Client[]>
	deleteById(params: { clientId: string }): Promise<void>
	updateById(params: {
		clientId: string
		data: Partial<z.infer<typeof createClientSchema>>
	}): Promise<void>
	getById(params: { clientId: string }): Promise<Client | null>
}

export const dal: DalClient = {
	async getById(params) {
		const [client] = await db
			.select()
			.from(clientModule)
			.where(eq(clientModule.id, params.clientId))
		return client
	},
	async updateById(params) {
		// todo validate if client exists before update
		const clientExists = await this.getById({ clientId: params.clientId })
		if (!clientExists)
			throw new HTTPException(404, { message: 'Client not found' })
		try {
			await db
				.update(clientModule)
				.set({
					...params.data,
				})
				.where(eq(clientModule.id, params.clientId))
		} catch (error) {
			throw new HTTPException(500, {
				message: 'Error updating client',
				cause: error,
			})
		}
	},
	async create(params) {
		// we need validate something here????
		try {
			const [$client] = await db
				.insert(clientModule)
				.values({
					...params.data,
					business: params.businessId,
				})
				.returning()

			if (!$client) {
				throw new HTTPException(500, {
					message: 'Client could not be created',
				})
			}
			return $client
		} catch (error) {
			throw new HTTPException(500, {
				message: 'Error client',
				cause: error,
			})
		}
	},
	async getByBusiness(params) {
		const clients = await db
			.select()
			.from(clientModule)
			.where(eq(clientModule.business, params.businessId))
		if (clients.length < 1) {
			throw new HTTPException(404, {
				message: 'No clietn found for this business',
			})
		}
		return clients
	},
	async deleteById(params) {
		// todo validate if client exists before delete
		try {
			await db.delete(clientModule).where(eq(clientModule.id, params.clientId))
		} catch (error) {
			throw new HTTPException(500, {
				message: 'Error deleting client',
				cause: error,
			})
		}
	},
}
