import { createMiddleware } from 'hono/factory'
import { auth } from '../lib/auth'

export const authMiddleware = createMiddleware(async (c, next) => {
	const headers = c.req.raw.headers
	const session = await auth.api.getSession({ headers })

	// todo: this error is fine: how to
	if (!session || !session.user) {
		return c.json({ error: 'Unauthorized' }, 401)
	}

	c.set('user', session.user)
	c.set('session', session.session)
	return next()
})
