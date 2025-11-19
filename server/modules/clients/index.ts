import { dal } from './dal'
import { app } from './routes'

export const clients = {
	routes: app,
	dal,
}
