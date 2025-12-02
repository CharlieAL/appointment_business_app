import type { AppointmentService } from '~/server/db/schema/appointment_service'

export const mockAppointmentService = ({
	service,
	appointment,
}: {
	service: string
	appointment: string
}): AppointmentService => ({
	service: service,
	appointment: appointment,
})

export type AS = {
	appointmentId: string[]
	serviceIds: string[]
}

export const mockAppointmentServices = ({
	params,
}: {
	params: AS[]
}): AppointmentService[] => {
	const results: AppointmentService[] = []
	function generateMockData(a: string, s: string[]) {
		for (const service of s) {
			const as = mockAppointmentService({
				service: service,
				appointment: a,
			})
			results.push(as)
		}
	}

	function getRandomN(arr: string[]): number {
		// get n 0..arr.length
		return Math.floor(Math.random() * arr.length)
	}

	for (const b of params) {
		for (const a of b.appointmentId) {
			const n = getRandomN(b.serviceIds)
			const selectedServiceIds = b.serviceIds.slice(0, n + 1)
			generateMockData(a, selectedServiceIds)
		}
	}
	return results
}
