import type { User } from '@server/share'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	plugins: [inferAdditionalFields<User>()],
	baseURL: 'http://localhost:3000',
	basePath: '/api/v1/auth',
})
