import { createFileRoute } from '@tanstack/react-router'
import { getMeQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Profile = () => {
	const { isPending, error, data } = useQuery(getMeQueryOptions)

	if (isPending) return 'Loading...'
	if (error) return `Something went wrong.. ${error.message}`
	if (!data.user)
		return 'We had trouble loading your profile... try again later? :)'

	const { user } = data
	const avatarFallback = `${user.given_name[0].toUpperCase()}${user.family_name[0].toUpperCase()}`
	return (
		<div className="p-2">
			<Avatar>
				<AvatarImage
					src={user.picture || undefined}
					alt={`${user.given_name}'s avatar`}
				/>
				<AvatarFallback>{avatarFallback}</AvatarFallback>
			</Avatar>
			<h2 className="my-4">Hello {`${user.given_name} ${user.family_name}`}</h2>
			<a href="/api/auth/logout">Logout</a>
		</div>
	)
}

export const Route = createFileRoute('/_authenticated/profile')({
	component: Profile,
})
