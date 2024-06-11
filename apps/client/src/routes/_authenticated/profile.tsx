import { createFileRoute } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

const Profile = () => {
	const { isPending, error, data } = useQuery(userQueryOptions)

	if (isPending) return 'Loading...'
	if (error) return `Something went wrong.. ${error.message}`

	return (
		<div className="p-2">
			<h2>Hello {`${data.user.given_name} ${data.user.family_name}`}</h2>
			<a href="/api/auth/logout">Logout</a>
		</div>
	)
}

export const Route = createFileRoute('/_authenticated/profile')({
	component: Profile,
})
