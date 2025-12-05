import type { User } from '@server/share'
import { toast } from 'sonner'
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
	INVALID_EMAIL_OR_PASSWORD: {
		en: 'invalid email or password',
		es: 'correo o contraseña inválidos',
	},
} satisfies ErrorTypes

const getErrorMessage = (code: string, lang: 'en' | 'es') => {
	console.log('Error code:', code)
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
	console.log('Redirecting to login page')
	// toast notification can be added here
	window.location.href = '/login'
}

function handleAuthError(code: ErrorCode) {
	const message = getErrorMessage(code, LANG)
	toast.error(message)
	if (code === 'FAILED_TO_GET_SESSION') {
		deleteLocalSession()
		redirectToLogin()
	}
}

export const logout = async () => {
	const { error } = await authClient.signOut({})
	if (error) {
		const errorCode = error?.code as ErrorCode
		handleAuthError(errorCode)
	}
}
interface AuthResponse {
	user: User
	token: string
}

interface Error {
	message: string
	code?: string
}

type Result<T, E = Error> = { data: T; error: null } | { data: null; error: E }

type AsyncResult<T, E = Error> = Promise<Result<T, E>>

export function success<T>(data: T): Result<T, never> {
	return { data, error: null }
}

export function failure<E extends Error>(error: E): Result<never, E> {
	return { data: null, error }
}
export const login = async ({
	email,
	password,
	rememberMe,
}: {
	email: string
	password: string
	rememberMe: boolean
}): AsyncResult<AuthResponse, Error> => {
	const { data, error } = await authClient.signIn.email({
		email,
		password,
		rememberMe,
	})
	// i need to handle errors
	if (error) {
		const errorCode = error?.code as ErrorCode
        const message = getErrorMessage(errorCode, LANG)
        return failure({ message, code: errorCode })
	}

	// this works but better-auth cant change type of user yet
	const userData: User = data?.user as User
	return success({ user: userData, token: data?.token || '' })
}
interface SignUpParams {
	name: string
	email: string
	phone?: string
	password: string
}

export const register = async (
	params: SignUpParams
): Promise<AuthResponse | null> => {
	const { data, error } = await authClient.signUp.email({
		name: params.name,
		email: params.email,
		// this works, but better-auth has no handle others data like phone
		// acually it has :) i just checked the code
		phone: params.phone,
		password: params.password,
		callbackURL: '/',
	})
	if (error) {
		const errorCode = error?.code as ErrorCode
		handleAuthError(errorCode)
	}

	if (!data?.user) {
		return null
	}

	return {
		user: data.user,
		token: data.token || '',
	}
}
