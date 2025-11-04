import { Hono } from 'hono'
import { auth } from '~/server/lib/auth'

const app = new Hono()
	.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
	.get('/status-server', (c) => {
		return c.text('Hello Hono!')
	})

export { app as routesV1 }
