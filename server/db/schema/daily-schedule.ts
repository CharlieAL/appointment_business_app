import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, time, timestamp, uuid } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { business } from './business'

export const weekEnum = pgEnum('week', [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
])

export const dailySchedule = pgTable('daily_schedule', {
	id: uuid('id').primaryKey(),
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
})

export const dailyScheduleRelations = relations(dailySchedule, ({ one }) => ({
	business: one(business, {
		fields: [dailySchedule.business],
		references: [business.id],
	}),
}))

export const insertDailyScheduleSchema = createInsertSchema(dailySchedule, {
	dayWeek: z.string().min(1, { error: 'Day of the week is required' }),
	openingTime: z.string().min(1, { error: 'Opening time is required' }),
	closingTime: z.string().min(1, { error: 'Closing time is required' }),
})

export const selectDailyScheduleSchema = createSelectSchema(dailySchedule)

export const createDailyScheduleSchema = insertDailyScheduleSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
})

export type DailySchedule = z.infer<typeof selectDailyScheduleSchema>
