import type { JSX } from 'react'
import { Route, Router, Switch, useLocation } from 'wouter'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/modules/auth/layouts/auth.layout'
import { SignInPage } from '@/modules/auth/pages/sign-in'
import { SignUpPage } from '@/modules/auth/pages/sign-up'
import { DashboardPage } from '@/modules/dashboard/pages'

export function Routes() {
	return (
		<Switch>
            <Route path="/" component={DashboardPage}  />
			<Router base="/auth">
				<AuthLayout>
					<Route path="/login" component={SignInPage} />
					<Route path="/register" component={SignUpPage} />
				</AuthLayout>
			</Router>
		</Switch>
	)
}

//this works but i dont like the loading is needed to avoid flicker
function ProtectedRoute({
	component,
	path,
}: {
	component: JSX.Element
	path: string
}) {
	const { user, isLoading } = useAuth()
	const [_, navigate] = useLocation()

    if (isLoading) {
        return null
    }

	if (!user) {
		navigate('/auth/login')
		return null
	}

	return <Route path={path}>{component}</Route>
}
