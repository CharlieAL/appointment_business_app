import { and, asc, eq, gte, lte, type SQL } from 'drizzle-orm'
import { db } from '~/server/db'
import { appointment } from '~/server/db/schema/appointment'
import { appointmentService } from '~/server/db/schema/appointment_service'
import { DatabaseError, ValidationError } from '~/server/errors/dal-error'
import { failure, success } from '~/server/types'
import { dal as dalClient } from '../clients/dal'
import { dal as dalService } from '../services/dal'
import type { AppointmentDal, AppointmentValidation } from './types'

export const appointmentValidations: AppointmentValidation = {
	getFilter(params) {
		//TODO: https://orm.drizzle.team/docs/dynamic-query-building if scale this is better
		const filters: SQL[] = []
		const { filters: f } = params

		if (f.from && f.to) {
			if (f.from > f.to) {
				return failure(
					new ValidationError('"from" date must be earlier than "to" date')
				)
			}

			filters.push(gte(appointment.date, f.from))
			filters.push(lte(appointment.date, f.to))
		}

		if (f.status) {
			filters.push(eq(appointment.status, f.status))
		}

		if (f.worker) {
			filters.push(eq(appointment.worker, f.worker))
		}

		return success(filters.length > 0 ? and(...filters) : undefined)
	},
	async validateNoDoubleBooking(params) {
		try {
			const [appointmentExist] = await db
				.select()
				.from(appointment)
				.where(
					and(
						eq(appointment.worker, params.worker),
						eq(appointment.date, params.date)
					)
				)

			if (appointmentExist) {
				return failure(
					new ValidationError(
						'Worker already has an appointment at the given date and time'
					)
				)
			}
			return success(undefined)
		} catch (error) {
			return failure(
				new DatabaseError('Error validating double booking', error)
			)
		}
	},
}

export const dal: AppointmentDal = {
	async getById(params) {
		try {
			const [$appointment] = await db
				.select()
				.from(appointment)
				.where(eq(appointment.id, params.id))
			if (!appointment) {
				return failure(new ValidationError('Appointment not found'))
			}
			return success($appointment)
		} catch (error) {
			return failure(
				new DatabaseError('Error getting appointment by id', error)
			)
		}
	},
	async get(params) {
		try {
			const { data: fSql, error } = appointmentValidations.getFilter({
				filters: params.filters,
			})
			if (error) {
				return failure(error)
			}

			const whereClause = fSql
				? and(eq(appointment.business, params.business), fSql)
				: eq(appointment.business, params.business)

			const appointments = await db
				.select()
				.from(appointment)
				.where(whereClause)
				.orderBy(asc(appointment.date))
				.limit(100) // TODO: pagination

			return success(appointments)
		} catch (error) {
			return failure(new DatabaseError('Error getting appointments', error))
		}
	},
	async create(params) {
		try {

			//validate date not in the past
			if (params.appointment.date < params.now) {
				return failure(
					new ValidationError('Cannot create appointment in the past')
				)
			}

			// validate if worker and date already have an appointment ??
			const { error: doubleBookingError } =
				await appointmentValidations.validateNoDoubleBooking({
					worker: params.worker,
					date: params.appointment.date,
				})

			if (doubleBookingError) {
				return failure(doubleBookingError)
			}

			// validate client belongs to business
			let clientId = null

			if (params.appointment.client) {
				const { data: $clientId, error } = await dalClient.getByBusinessAndId({
					clientId: params.appointment.client,
					businessId: params.business,
				})
				if (error) {
					return failure(error)
				}
				clientId = $clientId.id
			}

			//TODO: move to service dal validates
			const { data, error } = await dalService.getByBusiness({
				businessId: params.business,
			})
			if (error) {
				return failure(error)
			}
			const serviceIds = data.map((s) => s.id)
			const invalidService = params.appointment.services?.find(
				(s) => !serviceIds.includes(s.id)
			)
			if (invalidService) {
				return failure(
					new ValidationError(
						`Service ${invalidService.id} does not belong to the business`
					)
				)
			}

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
						client: clientId,
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
			return failure(new DatabaseError('Error appointment', error))
		}
	},
	async update(params) {
		try {
            // validate date not in the past
            if (params.data.date && params.data.date < params.now) {
                return failure(
                    new ValidationError('Cannot update appointment to a past date')
                )
            }
			// validate appointment exists and belongs to business
			const { data: existingAppointment, error: getError } = await this.getById(
				{
					id: params.id,
				}
			)
			if (getError) {
				return failure(getError)
			}
			if (existingAppointment.business !== params.business) {
				return failure(
					new ValidationError('Appointment does not belong to business')
				)
			}

			const [$appointment] = await db
				.update(appointment)
				.set({
					...params.data,
				})
				.where(eq(appointment.id, params.id))
				.returning()
			return success($appointment)
		} catch (error) {
			return failure(new DatabaseError('Error updating appointment', error))
		}
	},
}
