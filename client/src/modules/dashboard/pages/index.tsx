import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardPage() {
	return (
		<div>
			{/* header */}
			<Header />
			{/* data */}

			{/* next appointments */}
			{/* chart earnings */}
		</div>
	)
}

function Header() {
	return (
		<nav className="w-full flex justify-between items-center h-32 border-b">
			<div className="flex flex-col justify-center">
				<h1 className="text-4xl font-semibold">Dashboard</h1>
				<span className="text-muted-foreground ">Bienvenido Nombre</span>
			</div>
			<div>
				<Button>
					<Plus />
				</Button>
			</div>
		</nav>
	)
}
