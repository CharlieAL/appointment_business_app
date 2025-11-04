import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import { db } from '~/server/db' // your drizzle instance
import { schema } from '~/server/db/schema'

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
			user: schema.auth.user,
			session: schema.auth.session,
			account: schema.auth.account,
			verification: schema.auth.verification,
		},
	}),
	emailAndPassword: {
		enabled: true,
	},
  emailVerification:{
    sendVerificationEmail: async ( { user, url, token }, request) => {
      // await sendEmail({
      //   to: user.email,
      //   subject: "Verify your email address",
      //   text: `Click the link to verify your email: ${url}`,
      // });
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
})
