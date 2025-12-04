import type { ComponentType } from 'react'
import {
	Route,
	type RouteComponentProps,
	Router,
	Switch,
	useLocation,
} from 'wouter'
import { useUser } from '@/modules/auth/hooks/useUser'
import { AuthLayout } from '@/modules/auth/layouts/auth.layout'
import { SignInPage } from '@/modules/auth/pages/sign-in'
import { SignUpPage } from '@/modules/auth/pages/sign-up'
import { DashboardPage } from '@/modules/dashboard/pages'

export function Routes() {
	return (
		<Switch>
			<ProtectedRoute path="/" component={DashboardPage} />
			<Router base="/">
				<AuthLayout>
					<Route path="/login" component={SignInPage} />
					<Route path="/register" component={SignUpPage} />
				</AuthLayout>
			</Router>
		</Switch>
	)
}
// this works but when the session expires it does not redirect to login
// i need to delete user in local storage when session expires
// ProtectedRoute component to protect routes
function ProtectedRoute({
	component: Component,
	path,
}: {
	component: ComponentType<RouteComponentProps>
	path: string
}) {
	const { user } = useUser()
	const [_, navigate] = useLocation()

	if (!user) {
		navigate('/login')
		return null
	}

	return <Route path={path} component={Component} />
}
