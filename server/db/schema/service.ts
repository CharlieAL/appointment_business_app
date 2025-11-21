import { relations } from 'drizzle-orm'
import {
	integer,
	numeric,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { business } from './business'

export const service = pgTable('services', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 70 }).notNull(),
	notes: varchar('notes', { length: 200 }),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(), // Price with two decimal places example: 99.99
	duration: integer('duration').notNull(),
	business: uuid('business_id')
		.references(() => business.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const serviceRelations = relations(service, ({ one }) => ({
	business: one(business, {
		fields: [service.business],
		references: [business.id],
	}),
}))

export const insertServiceSchema = createInsertSchema(service, {
	name: z.string().min(1, { message: 'Name is required' }),
	price: z
		.string()
		.min(1, { message: 'must be at least 1 character' })
		.regex(/^\d+(\.\d{1,2})?$/, { message: 'must be a valid monetary value' }),
	duration: z.number().min(1, { message: 'Duration is required' }),
	notes: z.string().optional(),
})

export const selectServiceSchema = createSelectSchema(service)

export const createServiceSchema = insertServiceSchema.omit({
	id: true,
	createdAt: true,
	business: true,
	updatedAt: true,
})

export const updateServiceSchema = createServiceSchema
	.extend({
		price: createServiceSchema.shape.price.optional().nullish(),
	})
	.partial()

export type Service = z.infer<typeof selectServiceSchema>
export type CreateServiceSchemaInput = z.infer<typeof createServiceSchema>
export type UpdateServiceSchemaInput = z.infer<typeof updateServiceSchema>
