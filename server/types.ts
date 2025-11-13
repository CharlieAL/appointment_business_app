import type { User } from '~/server/db/schema/auth'
import type { Session } from '~/server/lib/auth'

export type HonoEnv = {
	Variables: {
		user: User
		session: Session
	}
}
