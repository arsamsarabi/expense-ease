import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { db } from '../db'
import {
	expenses as expensesTable,
	insertExpenseSchema,
} from '../db/schema/expenses.schema'
import { and, desc, eq, sum } from 'drizzle-orm'
import { getUserMiddleware } from '../middlewares/auth.middleware'
import { createExpenseSchema } from '../sharedTypes'

export const expensesRoute = new Hono()
	.get('/', getUserMiddleware, async (c) => {
		const user = c.var.user
		const expenses = await db
			.select()
			.from(expensesTable)
			.where(eq(expensesTable.userId, user.id))
			.orderBy(desc(expensesTable.createdAt))

		return c.json({ expenses })
	})
	.get('/:id{[0-9]+}', getUserMiddleware, async (c) => {
		const user = c.var.user
		const id = Number.parseInt(c.req.param('id'))

		const expense = await db
			.select()
			.from(expensesTable)
			.where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
			.then((res) => res[0])

		if (!expense) {
			return c.notFound()
		}

		return c.json({ expense })
	})
	.get('/total-spent', getUserMiddleware, async (c) => {
		const user = c.var.user
		const result = await db
			.select({ total: sum(expensesTable.amount) })
			.from(expensesTable)
			.where(eq(expensesTable.userId, user.id))
			.limit(1)
			.then((res) => res[0])

		return c.json(result)
	})
	.post(
		'/',
		zValidator('json', createExpenseSchema, (result, c) => {
			if (!result.success) {
				return c.text('Invalid!', 400)
			}
		}),
		getUserMiddleware,
		async (c) => {
			const user = c.var.user
			const expense = await c.req.valid('json')

			const validatedExpenseObject = insertExpenseSchema.parse({
				...expense,
				userId: user.id,
			})

			const result = await db
				.insert(expensesTable)
				.values(validatedExpenseObject)
				.returning()

			c.status(201)
			return c.json(result)
		}
	)
	.delete('/:id{[0-9]+}', getUserMiddleware, async (c) => {
		const user = c.var.user
		const id = Number.parseInt(c.req.param('id'))

		const expense = await db
			.delete(expensesTable)
			.where(and(eq(expensesTable.userId, user.id), eq(expensesTable.id, id)))
			.returning()
			.then((res) => res[0])

		if (!expense) {
			return c.notFound()
		}

		return c.json({ expense })
	})
	.put('/', getUserMiddleware, (c) => {
		return c.json({})
	})
