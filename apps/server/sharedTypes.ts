import { z } from 'zod'

import { insertExpenseSchema } from './db/schema/expenses.schema'

export const createExpenseSchema = insertExpenseSchema.omit({
	userId: true,
	createdAt: true,
})
