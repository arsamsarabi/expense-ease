import { createFileRoute } from '@tanstack/react-router'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { OK } from 'readable-http-codes'

async function getTotalSpent() {
	const res = await api.expenses['total-spent'].$get()

	if (res.status !== OK) {
		throw new Error('Server error!')
	}

	return await res.json()
}

const Index = () => {
	const { isPending, error, data } = useQuery({
		queryKey: ['get-total-spent'],
		queryFn: getTotalSpent,
	})

	if (error) return `Something went wrong.. ${error.message}`

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Total spent</CardTitle>
				<CardDescription>The total amount you've spent.</CardDescription>
			</CardHeader>
			<CardContent>{isPending ? '...' : data.total}</CardContent>
		</Card>
	)
}

export const Route = createFileRoute('/_authenticated/')({
	component: Index,
})
