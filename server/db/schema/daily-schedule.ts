import { relations } from 'drizzle-orm'
import {
	pgEnum,
	pgTable,
	time,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { business } from './business'

export const weekEnum = pgEnum('week', ['0', '1', '2', '3', '4', '5', '6'])

export const daysEnum = z.enum(['0', '1', '2', '3', '4', '5', '6'])

export const dailySchedule = pgTable(
	'daily_schedule',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		dayWeek: weekEnum('day_week').notNull(),
		openingTime: time('opening_time').notNull(), // timestamp for the opening time ex: 09:00 AM
		closingTime: time('closing_time').notNull(), // timestamp for the closing time ex: 05:00 PM
		business: uuid('business_id')
			.notNull()
			.references(() => business.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(t) => [unique().on(t.dayWeek, t.business)]
)

export const dailyScheduleRelations = relations(dailySchedule, ({ one }) => ({
	business: one(business, {
		fields: [dailySchedule.business],
		references: [business.id],
	}),
}))

export const insertDailyScheduleSchema = createInsertSchema(dailySchedule, {
	dayWeek: z.enum(['0', '1', '2', '3', '4', '5', '6'], {
		message: 'Day of the week must be between 0 and 6',
	}),
	openingTime: z.iso.time({
		precision: -1,
		message: 'Opening time is not valid',
	}),
	closingTime: z.iso.time({
		precision: -1,
		message: 'Closing time is not valid',
	}),
})

export const selectDailyScheduleSchema = createSelectSchema(dailySchedule)

export const createDailyScheduleSchema = insertDailyScheduleSchema.omit({
	id: true,
	business: true,
	createdAt: true,
	updatedAt: true,
})
export type Week = z.infer<typeof weekEnum>
export type DailySchedule = z.infer<typeof selectDailyScheduleSchema>
