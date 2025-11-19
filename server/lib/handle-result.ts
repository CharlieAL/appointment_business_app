import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import {
	ConflictError,
	type DalError,
	DatabaseError,
	NotFoundError,
} from '../errors/dal-error'
//TODO: this file isn't being used currently, but maybe in the future
//       it could help to reduce boilerplate in route handlers
export function handleResult<T>(
	ctx: Context,
	result: { data: T; error: null } | { data: null; error: DalError }
) {
	if (result.error) {
		if (result.error instanceof NotFoundError) {
			throw new HTTPException(404, {
				message: result.error.message,
				cause: result.error.cause,
			})
		}

		if (result.error instanceof ConflictError) {
			throw new HTTPException(409, {
				message: result.error.message,
				cause: result.error.cause,
			})
		}
		if (result.error instanceof DatabaseError) {
			throw new HTTPException(500, {
				message: result.error.message,
				cause: result.error.cause,
			})
		}

		// Log error interno para debugging
		console.error('DAL Error:', result.error)

		throw new HTTPException(500, {
			message: 'Internal server error',
		})
	}

	return ctx.json({ data: result.data })
}
