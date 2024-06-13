import { Link } from '@tanstack/react-router'

export const Navbar = () => {
	return (
		<header className="p-4 flex justify-between">
			<h1>ExpensEase</h1>
			<nav className="flex gap-4">
				<Link to="/" className="[&.active]:font-bold">
					Home
				</Link>{' '}
				<Link to="/about" className="[&.active]:font-bold">
					About
				</Link>
				<Link to="/expenses" className="[&.active]:font-bold">
					Expenses
				</Link>
				<Link to="/create-expense" className="[&.active]:font-bold">
					Create
				</Link>
				<Link to="/profile" className="[&.active]:font-bold">
					Profile
				</Link>
			</nav>
		</header>
	)
}
