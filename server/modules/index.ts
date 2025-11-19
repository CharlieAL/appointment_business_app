import { Hono } from 'hono'
import { auth } from '~/server/lib/auth'
import { appointment } from './appointments'
import { business } from './business'
import { clients } from './clients'
import { configuration } from './configurations'
import { dailySchedule } from './daily-schedule'
import { services } from './services'

export const app = new Hono()
	.on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
	.route('/business', business.routes)
	.route('/appointments', appointment.routes)
	.route('/configurations', configuration.routes)
	.route('/daily-schedule', dailySchedule.routes)
	.route('/services', services.routes)
	.route('/clients', clients.routes)
