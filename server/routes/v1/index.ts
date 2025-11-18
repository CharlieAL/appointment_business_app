import { Hono } from 'hono'
import { auth } from '~/server/lib/auth'
import { appointment } from './appointments'
import { business } from './business'
import { clients } from './clients'
import { configuration } from './configurations'
import { dailySchedule } from './daily-schedule'
import { services } from './services'

const app = new Hono()
	.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
	.route('/business', business.controller)
	.route('/appointments', appointment.controller)
	.route('/configurations', configuration.controller)
	.route('/daily-schedule', dailySchedule.controller)
	.route('/services', services.controller)
	.route('/clients', clients.controller)
export { app as routesV1 }
