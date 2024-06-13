import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { OK } from 'readable-http-codes'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

async function getAllExpenses() {
	const res = await api.expenses.$get()

	if (res.status !== OK) {
		throw new Error('Server error!')
	}

	return await res.json()
}

async function getTotalSpent() {
	const res = await api.expenses['total-spent'].$get()

	if (res.status !== OK) {
		throw new Error('Server error!')
	}

	return await res.json()
}

const SkeletonLoader = () =>
	Array(3)
		.fill(0)
		.map((_, i) => (
			<TableRow key={i}>
				<TableCell className="font-medium">
					<Skeleton className="h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="h-4" />
				</TableCell>
				<TableCell>
					<Skeleton className="h-4" />
				</TableCell>
			</TableRow>
		))

const Expenses = () => {
	const { isPending, error, data } = useQuery({
		queryKey: ['get-all-expenses'],
		queryFn: getAllExpenses,
	})

	const {
		isPending: totalIsPending,
		error: totalError,
		data: totalData,
	} = useQuery({
		queryKey: ['get-total-spent'],
		queryFn: getTotalSpent,
	})

	if (error) return `Something went wrong.. ${error.message}`

	return (
		<div>
			<Table>
				<TableCaption>A list of all your expenses.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Id</TableHead>
						<TableHead>Date</TableHead>
						<TableHead>Title</TableHead>
						<TableHead className="text-right">Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isPending ? (
						<SkeletonLoader />
					) : (
						data?.expenses.map(({ id, title, amount, date }) => (
							<TableRow key={id}>
								<TableCell className="font-medium">{id}</TableCell>
								<TableCell>{date}</TableCell>
								<TableCell>{title}</TableCell>
								<TableCell className="text-right">£{amount}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell colSpan={3}>Total</TableCell>
						<TableCell className="text-right">
							{totalError
								? 'Error fetching total spent...'
								: totalIsPending
									? 'loading...'
									: `£${totalData?.total}`}
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	)
}

export const Route = createFileRoute('/_authenticated/expenses')({
	component: Expenses,
})
