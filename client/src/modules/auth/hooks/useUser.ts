import { useUserStore } from '../store/user.store'

export const useUser = () => {
	const user = useUserStore((state) => state.user)
	const clear = useUserStore((state) => state.clear)
	const setUser = useUserStore((state) => state.setUser)

	function saveUserSession(userData: typeof user) {
		setUser(userData)
	}

	function clearUserSession() {
		clear()
	}

	return { user, saveUserSession, clearUserSession }
}
