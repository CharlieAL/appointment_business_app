import { faker } from '@faker-js/faker'
import type { Appointment } from '../db/schema/appointment'

export const mockAppointment = ({
	clientId,
	workerId,
	business,
	startTime,
}: {
	clientId: string
	workerId: string
	business: string
	startTime: Date
}): Appointment => ({
	id: faker.string.uuid(),
	date: startTime,
	duration: faker.number.int(60),
	notas: faker.person.bio(),
	status: 'pending',
	profit: faker.number.int({ min: 100, max: 10000 }).toString(),
	client: clientId,
	worker: workerId,
	business: business,
	createdAt: faker.date.recent(),
	updatedAt: faker.date.recent(),
})

const appointmentsTime = [
	'08',
	'09',
	'10',
	'11',
	'12',
	'13',
	'14',
	'15',
	'16',
	'17',
	'18',
]

interface ClientsAndBusiness {
	ids: string[]
	businessId: string
}

interface UsersAndBusiness {
	ids: string[]
	businessId: string
}

export const mockAppointments = ({
	clients,
	users,
}: {
	clients: ClientsAndBusiness[]
	users: UsersAndBusiness[]
	perBusiness: number
}): Appointment[] => {
	const getUsersByBusiness = (id: string): string[] =>
		users.filter((u) => u.businessId === id)[0].ids

	type TestAppoint = {
		startTime: Date
		userId: string
		business: string
		clientId: string
	}

	const testAppoints: TestAppoint[] = []

	for (let i = 0; i < clients.length; i++) {
		const client = clients[i]
		const users = getUsersByBusiness(client.businessId)
		const clientIds = client.ids

		const [date] = faker.date.soon({ days: 3 }).toISOString().split('T')

		appointmentsTime.forEach((at, index) => {
			const dateS = `${date}T${at}:00:00.000Z`

			testAppoints.push({
				business: client.businessId,
				startTime: new Date(dateS),
				userId: users[Math.round(Math.random())],
				clientId: clientIds[index],
			})
		})
	}
	return testAppoints.map((a) =>
		mockAppointment({
			business: a.business,
			clientId: a.clientId,
			workerId: a.userId,
			startTime: a.startTime,
		})
	)
}
