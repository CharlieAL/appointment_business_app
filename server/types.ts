import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { User } from '~/server/db/schema/auth'
import type { Session } from '~/server/lib/auth'

export type HonoEnv = {
	Variables: {
		user: User
		session: Session
	}
}

export interface DalResponse<T> {
	data?: T | null
	err?: {
		message: string
		cause?: unknown
		code?: ContentfulStatusCode
	}
}

export type Result<T, E = Error> =
	| { data: T; error: null }
	| { data: null; error: E }

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>
// Helper functions
export function success<T>(data: T): Result<T, never> {
	return { data, error: null }
}

export function failure<E extends Error>(error: E): Result<never, E> {
	return { data: null, error }
}
