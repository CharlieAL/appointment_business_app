import { faker } from '@faker-js/faker'
import type { Business } from '~/server/db/schema/business'

export const mockBusiness = (): Business => ({
	id: faker.string.uuid(),
	name: faker.company.name(),
	phone: faker.phone.number({ style: 'national' }),
	email: faker.internet.email(),
	createdAt: faker.date.recent(),
	updatedAt: faker.date.recent(),
})

export const mockBusinesses = (count = 2): Business[] =>
	Array.from({ length: count }, mockBusiness)
