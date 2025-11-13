import { faker } from '@faker-js/faker'
import type { Client } from '~/server/db/schema/client'

export const mockClient = (businessId: string): Client => ({
	id: faker.string.uuid(),
	name: faker.person.fullName(),
	phone: faker.phone.number({ style: 'national' }),
	comments: faker.person.bio(),
	business: businessId, // relación con business
	createdAt: faker.date.recent(),
	updatedAt: faker.date.recent(),
})

export const mockClients = ({
	businessIds,
	perBusiness,
}: {
	businessIds: string[]
	perBusiness: number
}) =>
	businessIds.flatMap((id) =>
		Array.from({ length: perBusiness }, () => mockClient(id))
	)
