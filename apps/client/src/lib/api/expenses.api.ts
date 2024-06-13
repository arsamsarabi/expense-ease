import { OK } from 'readable-http-codes'
import { queryOptions } from '@tanstack/react-query'
import { api } from './api'

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
