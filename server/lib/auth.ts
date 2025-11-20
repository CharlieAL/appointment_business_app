import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import { db } from '~/server/db' // your drizzle instance
import { schema } from '~/server/db/schema'
import { VerifyEmail } from '../templates/verify-email'
import { sendEmail } from '../utils/email'

const clientUrl = process.env.CLIENT_URL
if (!clientUrl) {
	throw new Error('CLIENT_URL is not defined in environment variables')
}

export const auth = betterAuth({
	basePath: '/api/v1/auth',
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			...schema,
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification,
		},
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		autoSignIn: true,
	},
	user: {
		additionalFields: {
			role: { type: 'string', input: false },
			phone: { type: 'string', input: true, defaultValue: null },
			business: { defaultValue: null, input: false, type: 'string' },
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await sendEmail({
				to: user.email,
				subject: 'Verify your email address',
				template: VerifyEmail({
					name: user.name || 'User',
					verificationUrl: url,
				}).toString(),
			})
		},
	},
	trustedOrigins: [clientUrl],
	plugins: [
		openAPI({
			theme: 'deepSpace',
			disableDefaultReference: false,
			path: '/reference',
			title: 'Authentication API',
		}),
	],
	logger: {
		disabled: false,
		disableColors: false,
		level: 'error',
		log: (level, message, ...args) => {
			// Custom logging implementation
			console.log(`[${level}] ${message}`, ...args)
		},
	},
})
export type Session = typeof auth.$Infer.Session.session
