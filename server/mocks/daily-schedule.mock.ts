import { faker } from '@faker-js/faker'
import type { DailySchedule } from '../db/schema/daily-schedule'

type dayOfWeek = '0' | '1' | '2' | '3' | '4' | '5' | '6'

export const mockDailySchedule = ({
	day,
	businessId,
}: {
	day: dayOfWeek
	businessId: string
}): DailySchedule => ({
	id: faker.string.uuid(),
	business: businessId,
	dayWeek: day,
	openingTime: '8:00',
	closingTime: '18:00',
	createdAt: faker.date.recent(),
	updatedAt: faker.date.recent(),
})
const days = ['0', '1', '2', '3', '4', '5', '6'] as dayOfWeek[]
export const mockDailySchedules = ({
	businessIds,
	daysWork,
}: {
	businessIds: string[]
	daysWork: number
}): DailySchedule[] =>
	businessIds.flatMap((id) =>
		Array.from({ length: daysWork }, (_, i) => {
			return mockDailySchedule({ day: days[i], businessId: id })
		})
	)
