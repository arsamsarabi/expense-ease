import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useEffect, useState } from 'react'

export const App = () => {
	const [totalSpent, setTotalSpent] = useState(0)

	useEffect(() => {
		async function fetchTotalSpent() {
			const res = await fetch('/api/expenses/total-spent')
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
