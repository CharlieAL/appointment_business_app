import { relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { user } from './auth'
import { clients } from './client'
import { configuration } from './configuration'
import { dailySchedule } from './daily-schedule'
import { service } from './service'

export const business = pgTable('business', {
	id: uuid('id').primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	phone: varchar('phone', { length: 15 }).notNull().unique(),
	email: varchar('email', { length: 100 }).notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export const businessRelations = relations(business, ({ many, one }) => ({
	services: many(service),
	clients: many(clients),
	configuration: one(configuration),
	dailySchedule: many(dailySchedule),
	users: many(user),
}))

export const insertBusinessSchema = createInsertSchema(business, {
	name: z.string().min(1, { message: 'Name is required' }),
	phone: z.string().min(1, { message: 'Phone is required' }),
	email: z.email({ message: 'Invalid email address' }),
})

export const selectBusinessSchema = createSelectSchema(business)

export const createBusinessSchema = insertBusinessSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type Business = z.infer<typeof selectBusinessSchema>
