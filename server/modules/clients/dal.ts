import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import {
	type Client,
	type CreateClientInput,
	client as clientModule,
	type UpdateClientInput,
} from '~/server/db/schema/client'

import {
	type DalError,
	DatabaseError,
	NotFoundError,
} from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'
import { failure, success } from '~/server/types'

interface DalClient {
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

export const dal: DalClient = {
	async getById(params) {
		try {
			const [client] = await db
				.select()
				.from(clientModule)
				.where(eq(clientModule.id, params.clientId))
			return success(client)
		} catch (error) {
			return failure(new DatabaseError('Error getting client by id', error))
		}
	},
	async updateById(params) {
		// todo validate if client exists before update
		const clientExists = await this.getById({ clientId: params.clientId })
		if (!clientExists)
			return failure(new NotFoundError('Client', params.clientId))
		try {
			const cleanedData = Object.fromEntries(
				Object.entries(params.data).filter(([_, v]) => v != null)
			)
			const [$client] = await db
				.update(clientModule)
				.set(cleanedData)
				.where(eq(clientModule.id, params.clientId))
				.returning()
			return success($client)
		} catch (error) {
			return failure(new DatabaseError('Error updating client', error))
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
				return failure(
					new DatabaseError('Error creating client: no client returned', null)
				)
			}
			return success($client)
		} catch (error) {
			return failure(new DatabaseError('Error creating client', error))
		}
	},
	async getByBusiness(params) {
		try {
			const clients = await db
				.select()
				.from(clientModule)
				.where(eq(clientModule.business, params.businessId))
			return success(clients)
		} catch (error) {
			return failure(
				new DatabaseError('Error getting clients by business', error)
			)
		}
	},
	async deleteById(params) {
		// todo validate if client exists before delete
		try {
			await db.delete(clientModule).where(eq(clientModule.id, params.clientId))
			return success(undefined)
		} catch (error) {
			return failure(new DatabaseError('Error deleting client', error))
		}
	},
}
