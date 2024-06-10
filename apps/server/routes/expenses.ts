import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const expenseSchema = z.object({
	id: z.number().int().positive().min(1),
	title: z.string().min(3).max(100),
	amount: z.number().positive(),
})

const createPostSchema = expenseSchema.omit({ id: true })

type Expense = z.infer<typeof expenseSchema>

const fakeExpenses: Expense[] = [
	{ id: 1, title: 'Groceries', amount: 60.0 },
	{ id: 2, title: 'Electricity bill', amount: 80.0 },
	{ id: 3, title: 'Mortgage', amount: 1350.0 },
]

export const expensesRoute = new Hono()
	.get('/', async (c) => {
		return c.json({ expenses: fakeExpenses })
	})
	.get('/:id{[0-9]+}', async (c) => {
		const id = Number.parseInt(c.req.param('id'))
		const expense = fakeExpenses.find((expense) => expense.id === id)

		if (!expense) {
			return c.notFound()
		}

		return c.json({ expense })
	})
	.get('/total-spent', async (c) => {
		const total = fakeExpenses.reduce((total, { amount }) => total + amount, 0)
		return c.json({ total })
	})
	.post(
		'/',
		zValidator('json', createPostSchema, (result, c) => {
			if (!result.success) {
				return c.text('Invalid!', 400)
			}
		}),
		async (c) => {
			const expense = await c.req.valid('json')
			fakeExpenses.push({
				id: fakeExpenses.length + 1,
				...expense,
			})
			c.status(201)
			return c.json(expense)
		}
	)
	.delete('/:id{[0-9]+}', async (c) => {
		const id = Number.parseInt(c.req.param('id'))
		const index = fakeExpenses.findIndex((expense) => expense.id === id)

		if (index === -1) {
			return c.notFound()
		}

		const deletedExpense = fakeExpenses.splice(index, 1)[0]

		return c.json({ expense: deletedExpense })
	})
	.put('/', (c) => {
		return c.json({})
	})
