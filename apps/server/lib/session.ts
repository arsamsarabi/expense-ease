import type { SessionManager } from '@kinde-oss/kinde-typescript-sdk'
import type { Context } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { CookieOptions } from 'hono/utils/cookie'

let store: Record<string, unknown> = {}

export const sessionManager = (c: Context): SessionManager => ({
	async getSessionItem(key: string) {
		const result = getCookie(c, key)
		return result
	},
	async setSessionItem(key: string, value: unknown) {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			secure: true,
			sameSite: 'Lax',
		} as const

		setCookie(
			c,
			key,
			typeof value === 'string' ? value : JSON.stringify(value),
			cookieOptions
		)
	},
	async removeSessionItem(key: string) {
		deleteCookie(c, key)
	},
	async destroySession() {
		const cookiesToDelete = [
			'id_token',
			'access_token',
			'user',
			'refresh_token',
		]

		cookiesToDelete.forEach((key) => {
			deleteCookie(c, key)
		})
	},
})
