export class PbsApiError extends Error {
	readonly status: number
	readonly body: unknown

	constructor(message: string, status: number, body: unknown) {
		super(message)
		this.name = 'PbsApiError'
		this.status = status
		this.body = body
	}
}

export function isPbsApiError(error: unknown): error is PbsApiError {
	return error instanceof PbsApiError
}
