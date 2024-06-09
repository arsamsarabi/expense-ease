import { useEffect, useState } from 'react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { api } from '@/lib/api'

export const App = () => {
	const [totalSpent, setTotalSpent] = useState(0)

	useEffect(() => {
		async function fetchTotalSpent() {
			const res = await api.expenses['total-spent'].$get()
			const data = await res.json()
			setTotalSpent(data.total)
		}

		fetchTotalSpent()
	}, [])

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Total spent</CardTitle>
				<CardDescription>The total amount you've spent.</CardDescription>
			</CardHeader>
			<CardContent>{totalSpent}</CardContent>
		</Card>
	)
}
