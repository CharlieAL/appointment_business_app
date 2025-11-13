import { faker } from '@faker-js/faker'
import type { Service } from '~/server/db/schema/service'

export const mockService = (businessId: string): Service => ({
	id: faker.string.uuid(),
	name: faker.commerce.productName(),
	notes: faker.commerce.productDescription(),
	price: faker.number
		.float({ min: 100, max: 1000, fractionDigits: 2 })
		.toString(),
	duration: faker.number.int({ min: 5, max: 120 }),
	business: businessId, // relación con business
	createdAt: faker.date.recent(),
	updatedAt: faker.date.recent(),
})

export const mockServices = ({
	businessIds,
	perBusiness,
}: {
	businessIds: string[]
	perBusiness: number
}): Service[] =>
	businessIds.flatMap((id) =>
		Array.from({ length: perBusiness }, () => mockService(id))
	)
