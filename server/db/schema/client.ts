import { relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { appointment } from './appointment'
import { business } from './business'

export const client = pgTable('clients', {
	id: uuid('id').primaryKey().defaultRandom(),
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

export const clientsRelations = relations(client, ({ one, many }) => ({
	business: one(business, {
		fields: [client.business],
		references: [business.id],
	}),
	appointments: many(appointment),
}))

export const insertClientSchema = createInsertSchema(client, {
	name: z.string().min(1, { message: 'Name is required' }),
	phone: z.string().optional(),
	comments: z.string().optional(),
})

export const selectClientSchema = createSelectSchema(client)

export const createClientSchema = insertClientSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type Client = z.infer<typeof selectClientSchema>
