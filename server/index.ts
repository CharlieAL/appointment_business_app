import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { app as routesV1 } from './modules'
import { VerifyEmail } from './templates/verify-email'
import { sendEmail } from './utils/email'

// http://localhost:3000/api/auth/reference
const app = new Hono().basePath('')

app.use(logger())
app.use(cors())

const ApiRoutes = app
	.get('/', (c) => {
		return c.json({ message: 'Welcome to the API' })
	})
	.route('/api/v1', routesV1)
	.notFound((c) => {
		return c.json({ message: 'Route Not Found' }, 404)
	})

app.get('/test-send-email', async (c) => {
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

app.onError((error, c) => {
	if (error instanceof HTTPException) {
		console.error(error.cause)
		// Get the custom response
		return error.getResponse()
	}
	console.error('Global error handler:', error)
	return c.json({ message: 'Internal Server Error' }, 500)
})

export type ApiRoutes = typeof ApiRoutes
export default app
