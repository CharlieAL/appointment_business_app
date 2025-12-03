import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'

export const useAuth = () => {
	const {
		data: raw,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['auth-session'],
		queryFn: () => authClient.getSession(),
		staleTime: 10 * 10 * 10, // <- nunca se considera “viejo”
		refetchOnMount: false, // <- evita volver a hacer loading al entrar en ruta
		refetchOnReconnect: false,
	})
	const user = raw?.data?.user || null

	return {
		user,
		isLoading,
		error,
	}
}
