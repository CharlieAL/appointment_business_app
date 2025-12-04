import { authClient } from '@/lib/auth-client'
import { useUserStore } from '../store/user.store'

export const useUser = () => {
	const user = useUserStore((state) => state.user)
	const clear = useUserStore((state) => state.clear)
	const setUser = useUserStore((state) => state.setUser)
    const setToken = useUserStore((state) => state.setToken)
    const token = useUserStore((state) => state.token)

	function saveUserSession(userData: typeof user) {
		setUser(userData)
	}

	function clearUserSession() {
		clear()
	}

    function saveToken(tokenData: string) {
        setToken(tokenData)
    }

	return { user, saveUserSession, clearUserSession, saveToken, token }
}
