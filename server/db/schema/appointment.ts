import { relations } from 'drizzle-orm'
import {
	integer,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { user } from './auth'
import { client } from './client'

export const statusEnum = pgEnum('status', ['pending', 'canceled', 'completed'])
// the date its ok? : Yes but to sort by date need querie ? i can change to date only  and add start time and end time
export const appointment = pgTable('appointments', {
	id: uuid('id').primaryKey().defaultRandom(),
	date: timestamp('date').notNull(), // dateTtime - 2025-12-31T08:00:00.000Z
	duration: integer('duration').notNull(),
	profit: numeric('profit', { precision: 12, scale: 2 }).notNull(),
	status: statusEnum('status').notNull().default('pending'),
	notas: varchar('notas', { length: 200 }),
	client: uuid('client_id').references(() => client.id, {
		onDelete: 'set null',
	}),
	worker: text('worker_id')
		.notNull()
		.references(() => user.id, { onDelete: 'set null' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const appointmentRelations = relations(appointment, ({ one }) => ({
	client: one(client, {
		references: [client.id],
		fields: [appointment.client],
	}),
	worker: one(user, {
		references: [user.id],
		fields: [appointment.worker],
	}),
}))

export const insertAppointmentSchema = createInsertSchema(appointment, {
	date: z.date({ message: 'must be a valid date value' }),
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

export const createAppointmentSchema = insertAppointmentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	worker: true,
})

export type Appointment = z.infer<typeof selectAppointmentSchema>
