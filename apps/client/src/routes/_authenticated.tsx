import { userQueryOptions } from '@/lib/api'
import { Outlet, createFileRoute } from '@tanstack/react-router'

const Login = () => {
	return (
		<div>
			<h1>You have to log in</h1>
			<a href="/api/auth/login">Login</a>
		</div>
	)
}

const Component = () => {
	const { user } = Route.useRouteContext()
	if (!user) {
		return <Login />
	}

	return <Outlet />
}

export const Route = createFileRoute('/_authenticated')({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient
		try {
			const data = await queryClient.fetchQuery(userQueryOptions)
			return data
		} catch (error) {
			console.error('Could not authenticate user.')
			return { user: null }
		}
	},
	component: Component,
})
