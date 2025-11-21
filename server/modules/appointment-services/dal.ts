import { db } from '~/server/db'
import { appointmentService } from '~/server/db/schema/appointment_service'
import { DatabaseError } from '~/server/errors/dal-error'
import { failure, success } from '~/server/types'
import type { DalAppointmentServices } from './types'

export const dal: DalAppointmentServices = {
	async create(params) {
		try {
			const as = await db.transaction(async (tx) => {
				return await tx
					.insert(appointmentService)
					.values(params.data)
					.returning()
			})

			return success(as)
		} catch (error) {
			return failure(
				new DatabaseError('Error creating appointment services', error)
			)
		}
	},
}
