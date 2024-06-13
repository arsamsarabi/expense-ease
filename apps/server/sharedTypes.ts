import { z } from 'zod'

import { insertExpenseSchema } from './db/schema/expenses.schema'

export const createExpenseSchema = insertExpenseSchema.omit({
	id: true,
	userId: true,
	createdAt: true,
})

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
