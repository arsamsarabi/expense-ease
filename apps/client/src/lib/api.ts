import { hc } from 'hono/client'
import type { ApiRoutes } from '@server/app'
import { OK } from 'readable-http-codes'
import { queryOptions } from '@tanstack/react-query'

const client = hc<ApiRoutes>('/')

export const api = client.api

async function getMe() {
	const res = await api.auth.me.$get()

	if (res.status !== OK) {
		throw new Error('Error fetching profile.')
	}

	return await res.json()
}

export const userQueryOptions = queryOptions({
	queryKey: ['get-me'],
	queryFn: getMe,
	staleTime: Infinity,
})
