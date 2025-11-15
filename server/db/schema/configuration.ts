import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { business } from './business'

export const configuration = pgTable('configuration', {
	id: uuid('id').primaryKey().defaultRandom(),
	duration: integer('duration').notNull(),
	emailNotification: boolean('email_notification').default(false).notNull(),
	business: uuid('business_id')
		.notNull()
		.references(() => business.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const configurationRelations = relations(configuration, ({ one }) => ({
	business: one(business, {
		fields: [configuration.business],
		references: [business.id],
	}),
}))

export const insertConfigurationSchema = createInsertSchema(configuration, {
	duration: z.number().min(1, { message: 'Duration is required' }),
	emailNotification: z.boolean().default(false),
	business: z.uuid({ message: 'Business ID must be a valid UUID' }),
})

export const selectConfigurationSchema = createSelectSchema(configuration)

export const createConfigurationsSchema = insertConfigurationSchema.omit({
	id: true,
	business: true,
	createdAt: true,
	updatedAt: true,
})

export const updateConfigurationSchema = createInsertSchema(configuration)
	.omit({
		createdAt: true,
		updatedAt: true,
	})
	.partial()

export type Configuration = z.infer<typeof selectConfigurationSchema>
