import type { PropsWithChildren } from 'react'
import { Navbar } from './navbar'

export const Layout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Navbar />
			<hr />
			{children}
		</>
	)
}
