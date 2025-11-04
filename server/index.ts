import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { routesV1 } from './routes/v1'
import { VerifyEmail } from './templates/verify-email'
import { sendEmail } from './utils/email'

// http://localhost:3000/api/auth/reference
const app = new Hono().basePath('/api')

app.use(logger())
app.use(cors())

const ApiRoutes = app.route('/v1', routesV1).get('/test-email', async (c) => {
	try {
		await sendEmail({
			to: 'charlywwe2010@gmail.com',
			subject: 'Test Email',
			template: VerifyEmail({
				name: 'Test User',
				verificationUrl: 'https://example.com/verify',
			}).toString(),
		})
		return c.text(
			VerifyEmail({
				name: 'Test User',
				verificationUrl: 'https://example.com/verify',
			}).toString()
		)
	} catch (error) {
		console.error('Error sending test email:', error)
		return c.text('Failed to send test email.', 500)
	}
})

app.notFound((c) => {
	return c.json({ message: 'Route Not Found' }, 404)
})

app.onError((err, c) => {
	console.error('Global error handler:', err)
	return c.json({ message: 'Internal Server Error' }, 500)
})

export type ApiRoutes = typeof ApiRoutes
export default app
