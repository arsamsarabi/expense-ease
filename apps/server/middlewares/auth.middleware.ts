import type { UserType } from '@kinde-oss/kinde-typescript-sdk'
import { createMiddleware } from 'hono/factory'
import { sessionManager } from '../lib/session'
import { kindeClient } from '../lib/kinde'

type Env = {
	Variables: {
		user: UserType
	}
}

export const getUserMiddleware = createMiddleware<Env>(async (c, next) => {
	const unauthorised = c.json({ error: 'Unauthorised!' }, 401)

	try {
		const manager = sessionManager(c)
		const isAuthenticated = await kindeClient.isAuthenticated(manager)

		if (!isAuthenticated) {
			return unauthorised
		}

		const user = await kindeClient.getUser(manager)

		c.set('user', user)

		await next()
	} catch (error) {
		console.log(error)
		return unauthorised
	}
})
