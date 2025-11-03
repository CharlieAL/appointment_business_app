import { Link, Route, Switch } from 'wouter'
import { DashboardPage } from '@/modules/dashboard/pages'

export function Routes() {
	return (
		<Switch>
			<Route path="/" component={DashboardPage} />
			<Route path="/about" component={About} />
		</Switch>
	)
}

function Home() {
	return (
		<div>
			<h1>Home Page</h1>
			<Link href="/about">Go to About Page</Link>
		</div>
	)
}

function About() {
	return (
		<div>
			<h1>About Page</h1>
			<Link href="/">Go to Home Page</Link>
		</div>
	)
}
