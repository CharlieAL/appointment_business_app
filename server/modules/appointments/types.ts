import type { SQL } from 'drizzle-orm'
import z from 'zod'
import type {
	Appointment,
	CreateAppointment,
	UpdateAppointment,
} from '~/server/db/schema/appointment'
import type { DalError } from '~/server/errors/dal-error'
import type { AsyncResult, Result } from '~/server/types'

// Define methods for AppointmentDal here
// TODO: we need config data ??
//  getsByDate(params:{date:Date}):

// TODO: define filters type

//TODO: if change type from schema this is useless and will stop working

// TODO: add filter details boolean to include more details in the appointment like services, worker, client
export const appointmentFiltersSchema = z.object({
	from: z
		.string()
		.transform((val) => (val ? new Date(val) : undefined))
		.optional()
		.refine(
			(date) => (date instanceof Date ? !Number.isNaN(date.getTime()) : true),
			{
				message: 'Invalid date format for "from"',
			}
		),
	to: z
		.string()
		.transform((val) => (val ? new Date(val) : undefined))
		.optional()
		.refine(
			(date) => (date instanceof Date ? !Number.isNaN(date.getTime()) : true),
			{
				message: 'Invalid date format for "to"',
			}
		),
	status: z.enum(['pending', 'canceled', 'completed']).optional(),
	worker: z.string().optional(),
	details: z
		.string()
		.transform((val) => val === 'true')
		.optional(),
})

export type AppointmentFilters = z.infer<typeof appointmentFiltersSchema>

export interface AppointmentDal {
	create(params: {
		worker: string
		business: string
		appointment: CreateAppointment
	}): AsyncResult<Appointment, DalError>
	get(params: {
		filters: AppointmentFilters
		business: string
	}): AsyncResult<Appointment[], DalError>
	getById(params: { id: string }): AsyncResult<Appointment, DalError>
	update(params: {
		data: UpdateAppointment
		id: string
		business: string
	}): AsyncResult<Appointment, DalError>

	// delete(params: {
	//   id: string
	//   business: string
	// }): AsyncResult<void, DalError>
}

export interface AppointmentValidation {
	validateNoDoubleBooking(params: {
		worker: string
		date: Date
	}): AsyncResult<void, DalError>
	getFilter(params: {
		filters: AppointmentFilters
	}): Result<SQL | undefined, DalError>
}
