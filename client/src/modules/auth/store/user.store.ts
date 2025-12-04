import type { User } from '@server/share'
import {create} from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserStore {
    token: string | null
	user: User | null
    setToken: (token: string) => void
	setUser: (user: User | null) => void
	clear: () => void
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
            token: null,
            setToken: (token: string) => set({ token }),
			user: null,
			setUser: (user) => set({ user }),
			clear: () => set({ user: null }),
		}),
		{
			name: 'user-storage', // name of the item in the storage
			storage: createJSONStorage(() => localStorage),
		}
	)
)
