import { Link } from '@tanstack/react-router'

export const Navbar = () => {
	return (
		<div className="p-4 flex gap-4">
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
		</div>
	)
}
