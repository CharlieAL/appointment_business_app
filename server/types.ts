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
