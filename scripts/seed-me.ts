import { eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { appointment as ApointmentModel } from '~/server/db/schema/appointment'
import { appointmentService as ASModel } from '~/server/db/schema/appointment_service'
import { client as ClientModel } from '~/server/db/schema/client'
import { configuration as ConfigModel } from '~/server/db/schema/configuration'
import { dailySchedule as DSModel } from '~/server/db/schema/daily-schedule'
import { service as ServicesModel } from '~/server/db/schema/service'
import {
	type ClientsAndBusiness,
	mockAppointments,
	type UsersAndBusiness,
} from '~/server/mocks/appointments.mock'
import { mockClients } from '~/server/mocks/client.mock'
import { mockConfigurations } from '~/server/mocks/configuration.mock'
import { mockDailySchedules } from '~/server/mocks/daily-schedule.mock'
import { mockServices } from '~/server/mocks/service.mock'
import {
	type AS,
	mockAppointmentServices,
} from '~/server/mocks/serviceAppointment.mock'

const userId = process.env.USER_ID || ''
const businessId = process.env.USER_BUSINESS_ID || ''
console.log('Seeding data for user:', userId, 'business:', businessId)

if(!userId){
    throw new Error('USER_ID environment variable is not set')
}
if(!businessId){
    throw new Error('USER_BUSINESS_ID environment variable is not set')
}
async function seedMeee(businessId: string, userId: string) {
	const clients = mockClients({ businessIds: [businessId], perBusiness: 10 })
	const configurations = mockConfigurations({ businessIds: [businessId] })
	const dailySchedules = mockDailySchedules({
		businessIds: [businessId],
		daysWork: 5,
	})
	const services = mockServices({ businessIds: [businessId], perBusiness: 10 })
	const c: ClientsAndBusiness[] = [
		{ ids: clients.map((c) => c.id), businessId: businessId },
	]
	const u: UsersAndBusiness[] = [{ ids: [userId], businessId: businessId }]

	const appointments = mockAppointments({ clients: c, users: u })

	const params: AS = {
		appointmentId: appointments.map((a) => a.id),
		serviceIds: services.map((s) => s.id),
	}
	const appointmentServices = mockAppointmentServices({
		params: [params],
	})
    // delete existing data for the business to avoid duplicates
    console.log('Deleting existing data...')
    await db.transaction(async (tx) => {
      await tx.delete(ASModel)
        await tx.delete(ApointmentModel)
        await tx.delete(ServicesModel)
        await tx.delete(DSModel)
        await tx.delete(ConfigModel)
        await tx.delete(ClientModel)
    })
    console.log('Seeding new data...')

    await db.transaction(async (tx) => {
        await tx.insert(ClientModel).values(clients)
        await tx.insert(ConfigModel).values(configurations)
        await tx.insert(DSModel).values(dailySchedules)
        await tx.insert(ServicesModel).values(services)
        await tx.insert(ApointmentModel).values(appointments)
        await tx.insert(ASModel).values(appointmentServices)
    })

}

seedMeee(businessId, userId)
	.then(() => {
		console.log('SEEDING DONE ✅')
	})
	.catch((err) => {
		console.error('Error seeding data:', err)
	})
