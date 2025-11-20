import { mockAppointments } from './appointments.mock'
import { mockBusinesses } from './business.mock'
import { mockClients } from './client.mock'
import { mockConfigurations } from './configuration.mock'
import { mockDailySchedules } from './daily-schedule.mock'
import { mockServices } from './service.mock'
import { mockAppointmentServices } from './serviceAppointment.mock'
import { mockUsers } from './user.mock'
// mejorar las funciones para entender que generan datos falsos
export function generateMockData() {
	const businesses = mockBusinesses({ count: 4 })

	const services = mockServices({
		businessIds: businesses.map((b) => b.id),
		perBusiness: 2,
	})

	const users = mockUsers({
		businessIds: businesses.map((b) => b.id),
		perBusiness: 1,
	})

	const configurations = mockConfigurations({
		businessIds: businesses.map((b) => b.id),
	})

	const clients = mockClients({
		businessIds: businesses.map((b) => b.id),
		perBusiness: 11,
	})

	const dailySchedules = mockDailySchedules({
		daysWork: 5,
		businessIds: businesses.map((b) => b.id),
	})

	const clientsByBusiness = (id: string) =>
		clients.filter((c) => c.business === id).map((c) => c.id)

	const usersByBusiness = (id: string) =>
		users.filter((u) => u.business === id).map((u) => u.id)

	const appointments = mockAppointments({
		clients: businesses.map((b) => {
			return {
				businessId: b.id,
				ids: clientsByBusiness(b.id),
			}
		}),
		users: businesses.map((b) => {
			return {
				businessId: b.id,
				ids: usersByBusiness(b.id),
			}
		}),
		perBusiness: 10,
	})

	const appointmentServiceIdsByBusiness = businesses.map((b) => {
		const appointmentIds = appointments
			.filter((a) => a.business === b.id)
			.map((a) => a.id)
		const serviceIds = services
			.filter((s) => s.business === b.id)
			.map((s) => s.id)
		return {
			appointmentId: appointmentIds,
			serviceIds: serviceIds,
		}
	})

	const appointmentService = mockAppointmentServices({
		params: appointmentServiceIdsByBusiness,
	})

	return {
		businesses,
		services,
		users,
		configurations,
		clients,
		dailySchedules,
		appointments,
		appointmentService,
	}
}
