import { Hono } from 'hono'

const app = new Hono().post('/', async (c) => {
	c.status(201)
	return c.json('business app works!')
})

export { app }
