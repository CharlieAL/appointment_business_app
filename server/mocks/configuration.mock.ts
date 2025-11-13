import { faker } from '@faker-js/faker'
import type { Configuration } from '~/server/db/schema/configuration'

export const mockConfiguration = (businessId: string): Configuration => ({
	id: faker.string.uuid(),
	duration: faker.number.int(60),
	emailNotification: faker.datatype.boolean(),
	business: businessId,
	createdAt: faker.date.recent(),
	updatedAt: faker.date.recent(),
})

export const mockConfigurations = ({
	businessIds,
}: {
	businessIds: string[]
}): Configuration[] => businessIds.flatMap((id) => mockConfiguration(id))
