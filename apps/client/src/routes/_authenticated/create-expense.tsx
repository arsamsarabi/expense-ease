import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import type { FieldApi } from '@tanstack/react-form'
import {
	createExpense,
	getAllExpensesQueryOptions,
	loadingCreateExpenseQueryOptions,
} from '@/lib/api'
import { createExpenseSchema } from '@server/sharedTypes'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
	return (
		<>
			{field.state.meta.touchedErrors ? (
				<em>{field.state.meta.touchedErrors}</em>
			) : null}
			{field.state.meta.isValidating ? 'Validating...' : null}
		</>
	)
}

const CreateExpense = () => {
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const form = useForm({
		validatorAdapter: zodValidator,
		defaultValues: {
			title: '',
			amount: '0',
			date: new Date().toISOString(),
		},
		onSubmit: async ({ value }) => {
			const existingExpenses = await queryClient.ensureQueryData(
				getAllExpensesQueryOptions
			)

			navigate({ to: '/expenses' })

			queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
				expense: value,
			})

			try {
				const newExpense = await createExpense(value)
				queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
					...existingExpenses,
					expenses: [newExpense, ...existingExpenses.expenses],
				})
				toast('Expense Created', {
					description: `Successfully created a new expense. Expense ID: ${newExpense.id}`,
				})
			} catch (error) {
				toast('Oh oh!', {
					description: 'Failed to create a new expense.',
				})
			} finally {
				queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {})
			}
		},
	})

	return (
		<div>
			<h2>Create Expense</h2>

			<form
				className="mt-8 w-[600px]"
				onSubmit={(e) => {
					e.preventDefault()
					e.stopPropagation()
					void form.handleSubmit()
				}}
			>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<form.Field
						name="title"
						validators={{
							onChange: createExpenseSchema.shape.title,
						}}
						children={(field) => {
							return (
								<div className="w-full my-4">
									<Label htmlFor={field.name}>Title:</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Avocado on toast.."
										required
										type="text"
									/>
									<FieldInfo field={field} />
								</div>
							)
						}}
					/>
					<form.Field
						name="amount"
						validators={{
							onChange: createExpenseSchema.shape.amount,
						}}
						children={(field) => {
							return (
								<>
									<Label htmlFor={field.name}>Amount:</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="14.99"
										required
										type="number"
									/>
									<FieldInfo field={field} />
								</>
							)
						}}
					/>

					<form.Field
						name="date"
						validators={{
							onChange: createExpenseSchema.shape.date,
						}}
						children={(field) => {
							return (
								<>
									<Label htmlFor={field.name}>Amount:</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										required
										type="date"
									/>
								</>
							)
						}}
					/>
				</div>

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<Button
							variant="default"
							size="sm"
							type="submit"
							disabled={!canSubmit}
							className="mt-4 w-full"
						>
							{isSubmitting ? 'Submitting...' : 'Create Expense'}
						</Button>
					)}
				/>
			</form>
		</div>
	)
}

export const Route = createFileRoute('/_authenticated/create-expense')({
	component: CreateExpense,
})
