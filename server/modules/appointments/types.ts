import type { SQL } from 'drizzle-orm'
import z from 'zod'
import type {
	Appointment,
	CreateAppointment,
} from '~/server/db/schema/appointment'
import type { DalError } from '~/server/errors/dal-error'
import type { AsyncResult } from '~/server/types'

// Define methods for AppointmentDal here
// TODO: we need config data ??
//  getsByDate(params:{date:Date}):

// TODO: define filters type

//TODO: if change type from schema this is useless and will stop working
export const appointmentFiltersSchema = z.object({
	from: z.date().optional(),
	to: z.date().optional(),
	status: z.enum(['pending', 'canceled', 'completed']).optional(),
	worker: z.string().optional(),
})

export type AppointmentFilters = z.infer<typeof appointmentFiltersSchema>

export type AppointmentDal = {
	create(params: {
		worker: string
		business: string
		appointment: CreateAppointment
	}): AsyncResult<Appointment, DalError>
	getFilter(params: { filters: AppointmentFilters }): SQL | undefined
	validateClientBusiness(params: {
		clientId: string
		businessId: string
	}): AsyncResult<string, DalError>
}

/*
 TODO: create types for this

 {
  "date":"2025-12-31T08:00:00.000Z",
  "duration":60,
  "profit":"500.00",
  "notas":"le gusta mas largo de lo que dice",
  "client":"",
  "service":[
    {
      "id":""
    }
  ],
}
*/
