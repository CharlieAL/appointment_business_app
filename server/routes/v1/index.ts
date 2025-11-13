import { Hono } from 'hono'
import { auth } from '~/server/lib/auth'
import { appointment } from './appointments'
import { business } from './business'

const app = new Hono()
	.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
	.route('/business', business.controller)
	.route('/appointment', appointment.controller)

export { app as routesV1 }
