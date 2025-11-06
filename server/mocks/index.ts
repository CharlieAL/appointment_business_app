import { mockBusinesses } from './business.mock'
import { mockServices } from './service.mock'
import { mockUsers } from './user.mock'

export function generateMockData() {
	const businesses = mockBusinesses(3)
	const services = mockServices(
		businesses.map((b) => b.id),
		3
	)
	const users = mockUsers(
		businesses.map((b) => b.id),
		2
	)
	return {
		businesses,
		services,
		users,
	}
}
