import type { PropsWithChildren } from 'react'
import { Navbar } from './navbar'

export const Layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Navbar />
			<hr />
			<div className="p-2 max-w-3xl m-auto">{children}</div>
		</>
	)
}
