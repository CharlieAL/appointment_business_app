import { ThemeProvider } from './providers/theme-provider'
import { Routes } from './routes'

export function App() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<Routes />
		</ThemeProvider>
	)
}
