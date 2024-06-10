import { createFileRoute } from '@tanstack/react-router'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import type { FieldApi } from '@tanstack/react-form'

const CreateExpense = () => {
	const form = useForm({
		defaultValues: {
			title: '',
			amount: 0,
		},
		onSubmit: async ({ value }) => {
			// Do something with form data
			console.log(value)
		},
	})

	return (
		<div>
			<h2>Create Expense</h2>
			<form.provider>
				<form
					className="mt-8"
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
								onChange: ({ value }) =>
									!value
										? 'A first name is required'
										: value.length < 3
											? 'First name must be at least 3 characters'
											: undefined,
								onChangeAsyncDebounceMs: 500,
								onChangeAsync: async ({ value }) => {
									await new Promise((resolve) => setTimeout(resolve, 1000))
									return (
										value.includes('error') &&
										'No "error" allowed in first name'
									)
								},
							}}
							children={(field) => {
								// Avoid hasty abstractions. Render props are great!
								return (
									<>
										<label htmlFor={field.name}>First Name:</label>
										<input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
										/>
										<FieldInfo field={field} />
									</>
								)
							}}
						/>

						<Label htmlFor="title">Title</Label>
						<Input
							type="text"
							id="title"
							placeholder="Avocado on toast.."
							required
						/>
					</div>

					<div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
						<Label htmlFor="amount">Amount</Label>
						<Input type="number" id="amount" placeholder="14.99" required />
					</div>

					<Button className="mt-4" variant="default" size="sm" type="submit">
						Create Expense
					</Button>
				</form>
			</form.provider>
		</div>
	)
}

export const Route = createFileRoute('/create-expense')({
	component: CreateExpense,
})
