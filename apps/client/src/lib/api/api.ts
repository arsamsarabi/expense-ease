import { hc } from 'hono/client'
import type { ApiRoutes } from '@server/app'
import { OK } from 'readable-http-codes'
import { queryOptions } from '@tanstack/react-query'

const client = hc<ApiRoutes>('/')

export const api = client.api
