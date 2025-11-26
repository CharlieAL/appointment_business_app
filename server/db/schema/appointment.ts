import { relations } from 'drizzle-orm'
import {
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { appointmentService } from './appointment_service'
import { user } from './auth'
import { business } from './business'
import { client } from './client'

export const statusEnum = pgEnum('status', ['pending', 'canceled', 'completed'])
// the date its ok? : Yes but to sort by date need querie ? i can change to date only  and add start time and end time
export const appointment = pgTable(
	'appointments',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		date: timestamp('date').notNull(), // dateTtime - 2025-12-31T08:00:00.000Z
		duration: integer('duration').notNull(),
		profit: numeric('profit', { precision: 12, scale: 2 }).notNull(),
		status: statusEnum('status').notNull().default('pending'),
		notas: varchar('notas', { length: 200 }),
		client: uuid('client_id').references(() => client.id, {
			onDelete: 'set null',
		}),
		business: uuid('business_id')
			.notNull()
			.references(() => business.id, {
				onDelete: 'cascade',
			}),
		worker: text('worker_id')
			.notNull()
			.references(() => user.id, { onDelete: 'set null' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(t) => [unique().on(t.date, t.worker)]
) // no two appointments at the same time for the same worker``

export const appointmentRelations = relations(appointment, ({ one, many }) => ({
	client: one(client, {
		references: [client.id],
		fields: [appointment.client],
	}),
	worker: one(user, {
		references: [user.id],
		fields: [appointment.worker],
	}),
	services: many(appointmentService),
	business: one(business, {
		references: [business.id],
		fields: [appointment.business],
	}),
}))

export const insertAppointmentSchema = createInsertSchema(appointment, {
	date: z.coerce.date({ message: 'must be a valid date value' }),
	duration: z.number().min(1, { message: 'Duration is required' }),
	profit: z
		.string()
		.min(1, { message: 'must be at least 1 character' })
		.regex(/^\d+(\.\d{1,2})?$/, { message: 'must be a valid monetary value' }),
	status: z.enum(['pending', 'canceled', 'completed']).default('pending'),
	notas: z.string().optional(),
	client: z.uuid({ message: 'Invalid client ID' }).optional(),
})

export const selectAppointmentSchema = createSelectSchema(appointment)

export const createAppointmentSchema = insertAppointmentSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		worker: true,
		business: true,
	})
	.extend({
		services: z.array(z.object({ id: z.uuid() })).optional(),
	})

export const updateAppointmentSchema = createAppointmentSchema.partial()

export type Appointment = z.infer<typeof selectAppointmentSchema>
export type CreateAppointment = z.infer<typeof createAppointmentSchema>
export type UpdateAppointment = z.infer<typeof updateAppointmentSchema>
