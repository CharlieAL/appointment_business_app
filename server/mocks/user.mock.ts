import { faker } from '@faker-js/faker'
import type { User } from '~/server/db/schema/auth'

export const mockUser = (
	businessId: string,
	role: 'owner' | 'employee'
): User => ({
	id: faker.string.uuid(),
	name: faker.person.fullName(),
	email: faker.internet.email(),
	emailVerified: faker.datatype.boolean(),
	phone: faker.phone.number({ style: 'national' }),
	business: businessId,
	role: role,
	createdAt: faker.date.recent(),
	updatedAt: faker.date.recent(),
})

export const mockUsers = (businessIds: string[], perBusiness = 2): User[] => {
	const users: User[] = []
	// crear un owner por cada negocio
	businessIds.forEach((businessId) => {
		users.push(mockUser(businessId, 'owner'))
	})
	// crear empleados adicionales por negocio
	businessIds.flatMap((businessId) =>
		Array.from({ length: perBusiness }, () =>
			users.push(mockUser(businessId, 'employee'))
		)
	)

	return users
}
