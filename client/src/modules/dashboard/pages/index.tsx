import { Minus, Plus } from 'lucide-react'
import { useLocation } from 'wouter'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useUser } from '@/modules/auth/hooks/useUser'
import { logout } from '@/modules/auth/service/auth.service'

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
	const [_, navigate] = useLocation()
	const { user,token } = useUser()
	console.log('user dashboard', user)
	return (
		<nav className="w-full flex justify-between items-center h-32 border-b">
			<div className="flex flex-col justify-center">
				<h1 className="text-4xl font-semibold">Dashboard</h1>
				<span className="text-muted-foreground ">Bienvenido {user?.name}</span>
			</div>
			<div>
				<Button
					onClick={async () => {
                        await logout()
					}}
				>
					<Plus />
				</Button>
			</div>
		</nav>
	)
}
