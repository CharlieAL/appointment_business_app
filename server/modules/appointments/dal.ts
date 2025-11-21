import { and, eq, gte, lte, type SQL } from 'drizzle-orm'
import { db } from '~/server/db'
import { appointment } from '~/server/db/schema/appointment'
import { appointmentService } from '~/server/db/schema/appointment_service'
import { DatabaseError } from '~/server/errors/dal-error'
import { failure, success } from '~/server/types'
import type { AppointmentDal } from './types'

export const dal: AppointmentDal = {
	async create(params) {
		try {
			const aData = params.appointment
			const as = await db.transaction(async (tx) => {
				const services = aData.services

				const [$a] = await tx
					.insert(appointment)
					.values({
						date: aData.date,
						duration: aData.duration,
						profit: aData.profit,
						notas: aData.notas,
						worker: params.worker,
						business: params.business,
						client: aData.client,
					})
					.returning()

				if (!$a) {
					throw new Error('Could not create appointment')
				}

				// insert services
				if (services && services.length > 0) {
					const rows =
						services?.map((sId) => ({
							appointment: $a.id,
							service: sId.id,
						})) || []

					const $services = await tx
						.insert(appointmentService)
						.values(rows)
						.returning()

					if ($services.length === 0) {
						throw new Error('Could not create appointment services')
					}
				}

				return $a
			})

			return success(as)
		} catch (error) {
			return failure(new DatabaseError('Could not create appointment', error))
		}
	},
	getFilter(params) {
		//TODO: https://orm.drizzle.team/docs/dynamic-query-building if scale this is better
		const filters: SQL[] = []
		const { filters: f } = params

		if (f.from && f.to) {
			filters.push(gte(appointment.date, f.from))
			filters.push(lte(appointment.date, f.to))
		}

		if (f.status) {
			filters.push(eq(appointment.status, f.status))
		}

		if (f.worker) {
			filters.push(eq(appointment.worker, f.worker))
		}

		return filters.length > 0 ? and(...filters) : undefined
	},
}
