import type { User } from '@server/share'
import {create} from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserStore {
	user: User | null
	setUser: (user: User | null) => void
	clear: () => void
}

export const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
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
