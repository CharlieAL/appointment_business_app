import type { ContentfulStatusCode } from 'hono/utils/http-status'

export class DalError extends Error {
	constructor(
		message: string,
		public readonly code: ContentfulStatusCode,
		public readonly cause?: unknown
	) {
		super(message)
		this.name = 'DalError'
	}
}

export class NotFoundError extends DalError {
	constructor(entity: string, id?: string) {
		const message = id
			? `${entity} with id ${id} not found`
			: `${entity} not found`
		super(message, 404)
	}
}

export class ConflictError extends DalError {
	constructor(entity: string, message?: string) {
		super(message || `${entity} conflict`, 409)
	}
}

export class ValidationError extends DalError {
	constructor(message: string) {
		super(message, 400)
	}
}

export class DatabaseError extends DalError {
	constructor(message: string, cause?: unknown) {
		super(message, 500, cause)
	}
}
