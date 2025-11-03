import type { ReactNode } from 'react'

interface LayoutProps {
	children: ReactNode
}

export function Layout({ children }: LayoutProps) {
	return <div className="px-5">{children}</div>
}
