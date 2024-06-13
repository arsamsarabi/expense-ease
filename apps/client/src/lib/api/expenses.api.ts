import { OK } from 'readable-http-codes'
import { queryOptions } from '@tanstack/react-query'
import { api } from './api'
import { CreateExpenseInput } from '@server/sharedTypes'

const getAllExpenses = async () => {
	const res = await api.expenses.$get()

	if (res.status !== OK) {
		throw new Error('Server error!')
	}

	return await res.json()
}

export const getAllExpensesQueryOptions = queryOptions({
	queryKey: ['get-all-expenses'],
	queryFn: getAllExpenses,
	staleTime: 1000 * 60 * 5,
})

export const createExpense = async (value: CreateExpenseInput) => {
	await new Promise((r) => setTimeout(r, 3000))

	const res = await api.expenses.$post({ json: value })

	if (!res.ok) {
		throw new Error('Sever error')
	}

	const newExpense = await res.json()

	return newExpense
}

export const loadingCreateExpenseQueryOptions = queryOptions<{
	expense?: CreateExpenseInput | undefined
}>({
	queryKey: ['loading-create-expense'],
	queryFn: async () => {
		return {}
	},
	staleTime: Infinity,
})
