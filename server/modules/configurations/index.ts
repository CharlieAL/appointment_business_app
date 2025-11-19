import { dal } from './dal'
import { app } from './routes'

export const configuration = {
	routes: app,
	dal,
}
