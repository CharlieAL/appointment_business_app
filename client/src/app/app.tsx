import { TanstackProvider } from '@/integrations/tanstack-query/root-provider'
import { ThemeProvider } from './providers/theme-provider'
import { Routes } from './routes'

export function App() {
	return (
        <TanstackProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <Routes />
            </ThemeProvider>
        </TanstackProvider>
	)
}
