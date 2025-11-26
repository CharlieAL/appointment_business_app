import { zValidator as zv } from '@hono/zod-validator'
import type { ValidationTargets } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { ZodType } from 'zod'

export const zValidator = <
	T extends ZodType,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T
) =>
	zv(target, schema, (result) => {
		// TODO: validate query params to avoid invalid date formats
		if (!result.success) {
			throw new HTTPException(400, {
				message: result.error.issues.map((issue) => issue.message).join(', '),
				cause: result.error,
			})
		}
	})
