import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { db } from '../db'
import { expenses as expensesTable } from '../db/schema/expenses.schema'
import { eq } from 'drizzle-orm'
import { getUserMiddleware } from '../middlewares/auth.middleware'

const expenseSchema = z.object({
	id: z.number().int().positive().min(1),
	title: z.string().min(3).max(100),
	amount: z.string(),
})

const createPostSchema = expenseSchema.omit({ id: true })

type Expense = z.infer<typeof expenseSchema>

const fakeExpenses: Expense[] = [
	{ id: 1, title: 'Groceries', amount: '60.0' },
	{ id: 2, title: 'Electricity bill', amount: '80.0' },
	{ id: 3, title: 'Mortgage', amount: '1350.0' },
]

export const expensesRoute = new Hono()
	.get('/', getUserMiddleware, async (c) => {
		const user = c.var.user
		const expenses = await db
			.select()
			.from(expensesTable)
			.where(eq(expensesTable.userId, user.id))

		return c.json({ expenses })
	})
	.get('/:id{[0-9]+}', getUserMiddleware, async (c) => {
		const id = Number.parseInt(c.req.param('id'))
		const expense = fakeExpenses.find((expense) => expense.id === id)

		if (!expense) {
			return c.notFound()
		}

		return c.json({ expense })
	})
	.get('/total-spent', getUserMiddleware, async (c) => {
		const total = fakeExpenses.reduce((total, { amount }) => total + +amount, 0)
		return c.json({ total })
	})
	.post(
		'/',
		zValidator('json', createPostSchema, (result, c) => {
			if (!result.success) {
				return c.text('Invalid!', 400)
			}
		}),
		getUserMiddleware,
		async (c) => {
			const user = c.var.user
			const expense = await c.req.valid('json')

			const result = await db
				.insert(expensesTable)
				.values({
					...expense,
					userId: user.id,
				})
				.returning()

			c.status(201)
			return c.json(result)
		}
	)
	.delete('/:id{[0-9]+}', getUserMiddleware, async (c) => {
		const id = Number.parseInt(c.req.param('id'))
		const index = fakeExpenses.findIndex((expense) => expense.id === id)

		if (index === -1) {
			return c.notFound()
		}

		const deletedExpense = fakeExpenses.splice(index, 1)[0]

		return c.json({ expense: deletedExpense })
	})
	.put('/', getUserMiddleware, (c) => {
		return c.json({})
	})
