import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import type { FieldApi } from '@tanstack/react-form'
import { api } from '@/lib/api'

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
	const form = useForm({
		defaultValues: {
			title: '',
			amount: 0,
		},
		onSubmit: async ({ value }) => {
			const res = await api.expenses.$post({ json: value })

			if (!res.ok) {
				throw new Error('Sever error')
			}

			navigate({ to: '/expenses' })
		},
	})

	return (
		<div>
			<h2>Create Expense</h2>

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
						children={(field) => {
							return (
								<>
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
								</>
							)
						}}
					/>
					<form.Field
						name="amount"
						children={(field) => {
							return (
								<>
									<Label htmlFor={field.name}>Amount:</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) =>
											field.handleChange(Number.parseFloat(e.target.value))
										}
										placeholder="14.99"
										required
										type="number"
									/>
									<FieldInfo field={field} />
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
							className="mt-4"
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
