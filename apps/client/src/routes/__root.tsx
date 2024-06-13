import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Layout } from '@/components/layout'
import { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

const Root = () => {
	return (
		<>
			<Layout>
				<Outlet />
			</Layout>
			<TanStackRouterDevtools />
			<Toaster />
		</>
	)
}

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: Root,
})
