import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { auth } from '../lib/auth'

export const authMiddleware = createMiddleware(async (c, next) => {
	const headers = c.req.raw.headers
	const session = await auth.api.getSession({ headers })

	// todo: this error is fine: how to
	if (!session || !session.user) {
		throw new HTTPException(401, { message: 'Unauthorized' })
	}

	c.set('user', session.user)
	c.set('session', session.session)
	return next()
})
