import { and, eq, gte, lte, type SQL } from 'drizzle-orm'
import { db } from '~/server/db'
import { appointment } from '~/server/db/schema/appointment'
import { appointmentService } from '~/server/db/schema/appointment_service'
import { DatabaseError, ValidationError } from '~/server/errors/dal-error'
import { failure, success } from '~/server/types'
import { dal as dalClient } from '../clients/dal'
import { dal as dalService } from '../services/dal'
import type { AppointmentDal } from './types'

//TODO: check if client exists
export const dal: AppointmentDal = {
	//TODO: this can be in a dal client
	async validateClientBusiness(params) {
		try {
			const { data, error } = await dalClient.getById({
				clientId: params.clientId,
			})
			if (error) {
				return failure(error)
			}
			if (data.business !== params.businessId) {
				return failure(
					new ValidationError('Client does not belong to the business')
				)
			}
			return success(data.id)
		} catch (error) {
			return failure(
				new DatabaseError('Could not validate client business', error)
			)
		}
	},
	async create(params) {
		try {
			// validate if worker and date already have an appointment ??
			// TODO: this can be in a dal appointment method
			const appointmentExist = await db
				.select()
				.from(appointment)
				.where(
					and(
						eq(appointment.worker, params.worker),
						eq(appointment.date, params.appointment.date)
					)
				)

			if (appointmentExist.length > 0) {
				return failure(
					new ValidationError(
						'Worker already has an appointment at the given date and time'
					)
				)
			}

			let clientId = null
			if (params.appointment.client) {
				const { data: $clientId, error } = await this.validateClientBusiness({
					clientId: params.appointment.client,
					businessId: params.business,
				})
				if (error) {
					return failure(error)
				}
				clientId = $clientId
			}

			//TODO: validate services belong to business
			//TODO: move to service dal
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
