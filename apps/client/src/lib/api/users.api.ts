import { OK } from 'readable-http-codes'
import { queryOptions } from '@tanstack/react-query'
import { api } from './api'

const getMe = async () => {
	const res = await api.auth.me.$get()

	if (res.status !== OK) {
		throw new Error('Error fetching profile.')
	}

	return await res.json()
}

export const getMeQueryOptions = queryOptions({
	queryKey: ['get-me'],
	queryFn: getMe,
	staleTime: Infinity,
})
