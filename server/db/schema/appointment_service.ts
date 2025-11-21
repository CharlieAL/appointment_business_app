import { relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { appointment } from './appointment'
import { service } from './service'

export const appointmentService = pgTable('appointment_services', {
	id: uuid('id').primaryKey().defaultRandom(),
	service: uuid('service_id')
		.notNull()
		.references(() => service.id, { onDelete: 'cascade' }),
	appointment: uuid('appointment_id')
		.notNull()
		.references(() => appointment.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const appointmentServiceRelations = relations(
	appointmentService,
	({ one }) => ({
		appointments: one(appointment, {
			fields: [appointmentService.appointment],
			references: [appointment.id],
		}),
		services: one(service, {
			fields: [appointmentService.service],
			references: [service.id],
		}),
	})
)

export const insertAppointmentServiceSchema = createInsertSchema(
	appointmentService,
	{
		appointment: z.uuid({ message: 'Invalid ID' }),
		service: z.uuid({ message: 'Invalid ID' }),
	}
)

export const selectAppointmentServiceSchema =
	createSelectSchema(appointmentService)

export const createASSchema = selectAppointmentServiceSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type AppointmentService = z.infer<typeof createASSchema>
