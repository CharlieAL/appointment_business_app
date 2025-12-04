import type { User } from '@server/share'
import { USER_LOCAL_STORAGE_KEY } from '@/constants'
import { authClient } from '@/lib/auth-client'

const LANG: 'en' | 'es' = 'es' as const
type ErrorCode = keyof typeof authClient.$ERROR_CODES

type ErrorTypes = Partial<
	Record<
		ErrorCode,
		{
			en: string
			es: string
		}
	>
>

const errorCodes = {
	USER_ALREADY_EXISTS: {
		en: 'user already registered',
		es: 'usuario ya registrado',
	},
    FAILED_TO_GET_SESSION: {
        en: 'failed to get session, please login again',
        es: 'no se pudo obtener la sesión, por favor inicie sesión de nuevo',
    },
} satisfies ErrorTypes

const getErrorMessage = (code: string, lang: 'en' | 'es') => {
	if (code in errorCodes) {
		return errorCodes[code as keyof typeof errorCodes][lang]
	}
	const defaultMessage = {
		en: 'An unexpected error occurred',
		es: 'Ocurrió un error inesperado',
	}
	return defaultMessage[lang]
}

function deleteLocalSession() {
	// delete local session or token
	localStorage.removeItem(USER_LOCAL_STORAGE_KEY)
}

function redirectToLogin() {
	// toast notification can be added here
	window.location.href = '/login'
}

function handleSignOutError(code: ErrorCode) {
	const message = getErrorMessage(code, LANG)
	console.error('Sign out error:', message || code)
    if(code === 'FAILED_TO_GET_SESSION'){
        deleteLocalSession()
        redirectToLogin()
    }
    //toast
}

export const logout = async () => {
	const { error } = await authClient.signOut({})
	if (error) {
		const errorCode = error?.code as ErrorCode
		handleSignOutError(errorCode)
	}
}

interface LoginResponse {
	user: User
	token: string
}

export const login = async ({
	email,
	password,
	rememberMe,
}: {
	email: string
	password: string
	rememberMe: boolean
}): Promise<LoginResponse | null> => {
	try {
		const { data, error } = await authClient.signIn.email({
			email,
			password,
			rememberMe,
		})
		// i need to handle errors
		if (error) {
			console.log('Error signing in:', error)
			return null
		}
		// this works but better-auth cant change type of user yet
		if (data?.user) {
			return {
				user: data.user,
				token: data.token,
			}
		}
		return null
	} catch (error) {
		console.error('Unexpected error during sign in', error)
		return null
	}
}

interface SignUpParams {
	name: string
	email: string
	phone?: string
	password: string
}

export const register = async (params: SignUpParams) => {
	try {
		const { error } = await authClient.signUp.email({
			name: params.name,
			email: params.email,
			// this works, but better-auth has no handle others data like phone
			// acually it has :) i just checked the code
			phone: params.phone,
			password: params.password,
			callbackURL: '/',
		})
		if (error) {
			console.error('Error signing in:', error)
		}
	} catch (error) {
		console.error('Unexpected error during sign up', error)
	}
}
