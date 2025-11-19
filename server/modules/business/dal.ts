import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth'
import {
	type Business,
	business as businessModel,
	type CreateBusinessInput,
	type UpdateBusinessInput,
} from '~/server/db/schema/business'
import { type DalError, DatabaseError } from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'
import { failure, success } from '~/server/types'

interface BusinessDal {
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
export const dal: BusinessDal = {
	async get({ id }) {
		try {
			const [business] = await db
				.select()
				.from(businessModel)
				.where(eq(businessModel.id, id))

			return success(business)
		} catch (err) {
			return failure(new DatabaseError('Error getting business', err))
		}
	},
	async create({ business, userId }) {
		// TODO: some day we might want to run this in a transaction, but for now it's probably fine
		// TODO: also need to some validation??
		try {
			const [$business] = await db
				.insert(businessModel)
				.values(business)
				.returning()

			await db
				.update(user)
				.set({ business: $business.id })
				.where(eq(user.id, userId))

			return success($business)
		} catch (err) {
			return failure(new DatabaseError('Error creating business', err))
		}
	},
	async update({ id, business }) {
		try {
			const cleanedData = Object.fromEntries(
				Object.entries(business).filter(([_, v]) => v != null)
			)
			const [$business] = await db
				.update(businessModel)
				.set(cleanedData)
				.where(eq(businessModel.id, id))
				.returning()
			return success($business)
		} catch (err) {
			return failure(new DatabaseError('Error updating business', err))
		}
	},
}
