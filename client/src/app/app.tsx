import { Toaster } from '@/components/ui/sonner'
import { TanstackProvider } from '@/integrations/tanstack-query/root-provider'
import { ThemeProvider } from './providers/theme-provider'
import { Routes } from './routes'

export function App() {
	return (
		<TanstackProvider>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<Routes />
				<Toaster richColors position='top-center' />
			</ThemeProvider>
		</TanstackProvider>
	)
}
