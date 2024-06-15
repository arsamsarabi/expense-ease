import { createFileRoute } from '@tanstack/react-router'
import { CreateExpense } from '@/components/CreateExpense'

export const Route = createFileRoute('/_authenticated/create-expense')({
	component: CreateExpense,
})
