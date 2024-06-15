import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { TableCell, TableRow } from '@/components/ui/table'
import type { Expense } from '@server/sharedTypes'
import { deleteExpense, getAllExpensesQueryOptions } from '@/lib/api'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

type Props = Pick<Expense, 'date' | 'title' | 'amount'> & {
	id: number
}

export const ExpenseRow = ({ id, date, title, amount }: Props) => {
	const queryClient = new QueryClient()

	const mutation = useMutation({
		mutationFn: deleteExpense,
		onError: (e, v, c) => {
			console.log({ e, v, c })
			toast('Error', {
				description: `Failed to delete expense. ID: ${id}`,
			})
		},
		onSuccess: () => {
			queryClient.setQueryData(
				getAllExpensesQueryOptions.queryKey,
				(existingExpenses) => {
					console.log({ existingExpenses }) // FIXME: undefined

					return {
						...existingExpenses,
						expenses: existingExpenses!.expenses.filter(
							(expense) => expense.id !== id
						),
					}
				}
			)

			toast('Yay!', {
				description: 'Like it was never there!',
			})
		},
	})

	return (
		<TableRow>
			<TableCell className="font-medium">{id}</TableCell>
			<TableCell>{date}</TableCell>
			<TableCell>{title}</TableCell>
			<TableCell className="text-right">£{amount}</TableCell>
			<TableCell>
				<Button
					variant="ghost"
					size="sm"
					className="w-full"
					onClick={() => mutation.mutate(id)}
					disabled={mutation.isPending}
				>
					<Trash2 color="red" className="h-4 w-4" />
				</Button>
			</TableCell>
		</TableRow>
	)
}
