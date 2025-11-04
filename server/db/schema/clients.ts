import { relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { appointment } from './appointment'
import { business } from './business'

export const clients = pgTable('clients', {
	id: uuid('id').primaryKey(),
	name: varchar('name', { length: 70 }).notNull(),
	comments: varchar('comments', { length: 200 }),
	phone: varchar('phone', { length: 15 }),
	business: uuid('business_id')
		.notNull()
		.references(() => business.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const clientsRelations = relations(clients, ({ one, many }) => ({
	business: one(business, {
		fields: [clients.business],
		references: [business.id],
	}),
	appointments: many(appointment),
}))

export const insertClientsSchema = createInsertSchema(clients, {
	name: z.string().min(1, { message: 'Name is required' }),
	phone: z.string().optional(),
	comments: z.string().optional(),
})

export const selectClientsSchema = createSelectSchema(clients)

export const createClientsSchema = insertClientsSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type Clients = z.infer<typeof selectClientsSchema>
