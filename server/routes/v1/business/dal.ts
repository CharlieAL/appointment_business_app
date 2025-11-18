import { eq } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import type { z } from 'zod'
import { db } from '~/server/db'
import { user } from '~/server/db/schema/auth'
import {
	type Business,
	business as businessModel,
	type createBusinessSchema,
} from '~/server/db/schema/business'

interface BusinessDal {
	create(params: {
		business: z.input<typeof createBusinessSchema>
		userId: string
	}): Promise<Business>
	get(params: { id: string }): Promise<Business | null>
}

export const dal: BusinessDal = {
	async get({ id }) {
		try {
			const [business] = await db
				.select()
				.from(businessModel)
				.where(eq(businessModel.id, id))
			return business || null
		} catch (err) {
			throw new HTTPException(500, {
				message: 'Error fetching business',
				cause: err,
			})
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

			return $business
		} catch (err) {
			throw new HTTPException(500, {
				message: 'Error creating business',
				cause: err,
			})
		}
	},
}
