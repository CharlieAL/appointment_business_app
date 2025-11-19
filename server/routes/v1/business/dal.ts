import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth'
import {
	type Business,
	business as businessModel,
	type CreateBusinessInput,
	type UpdateBusinessInput,
} from '~/server/db/schema/business'

interface DalResponse<T> {
	data?: T | null
	error?: {
		message: string
		cause?: unknown
		code?: number
	}
}

interface BusinessDal {
	create(params: {
		business: CreateBusinessInput
		userId: string
	}): Promise<DalResponse<Business>>
	get(params: { id: string }): Promise<DalResponse<Business>>
	update(params: {
		id: string
		business: UpdateBusinessInput
	}): Promise<DalResponse<void>>
}
// TODO: delete all HTTPException and return { content, error }
export const dal: BusinessDal = {
	async get({ id }) {
		try {
			const [business] = await db
				.select()
				.from(businessModel)
				.where(eq(businessModel.id, id))
			return { data: business }
		} catch (err) {
			return {
				error: { message: 'Error fetching business', cause: err },
			}
		}
	},
	async create({ business, userId }) {
		try {
			const [$business] = await db
				.insert(businessModel)
				.values(business)
				.returning()

			await db
				.update(user)
				.set({ business: $business.id })
				.where(eq(user.id, userId))

			return {
				data: $business,
			}
		} catch (err) {
			return {
				error: { message: 'Error creating business', cause: err },
			}
		}
	},
	async update({ id, business }) {
		try {
			await db
				.update(businessModel)
				.set(business)
				.where(eq(businessModel.id, id))
				.returning()
			return { data: null }
		} catch (err) {
			return {
				error: { message: 'Error updating business', cause: err },
			}
		}
	},
}
