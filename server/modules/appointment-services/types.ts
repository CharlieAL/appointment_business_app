import type { AppointmentService } from '~/server/db/schema/appointment_service'
import type { DalError } from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'
//TODO: create params: {appointment:id, servicesIds[]}

export interface DalAppointmentServices {
	create(params: {
		data: AppointmentService[]
	}): AsyncResult<AppointmentService[], DalError>
}
