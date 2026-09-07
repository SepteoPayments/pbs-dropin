import { SESSIONS_PATH } from '../constants/defaults'
import { toCreateSessionResponse } from '../mappers/toCreateSessionResponse'
import type { CreateSessionRequest, CreateSessionResponse } from '../types'
import { createIdempotencyKey } from '../utils/idempotencyKey'
import { PbsApiError } from './errors'

export interface CreateSessionParams {
	apiBaseUrl: string
	accessToken: string
	body: CreateSessionRequest
	idempotencyKey?: string
}

function trimTrailingSlash(url: string): string {
	return url.replace(/\/+$/, '')
}

function isPathLikeMessage(value: string): boolean {
	return value.startsWith('/')
}

function readErrorMessage(body: unknown, fallback: string): string {
	if (typeof body === 'string' && body.trim().length > 0) {
		return body
	}
	if (body && typeof body === 'object') {
		const record = body as Record<string, unknown>
		const error = typeof record['error'] === 'string' ? record['error'] : ''
		const message = typeof record['message'] === 'string' ? record['message'] : ''
		if (error.length > 0 && !isPathLikeMessage(error)) {
			return error
		}
		if (message.length > 0 && !isPathLikeMessage(message)) {
			return message
		}
		if (error.length > 0) {
			return error
		}
		if (message.length > 0) {
			return message
		}
	}
	return fallback
}

export async function createSession(params: CreateSessionParams): Promise<CreateSessionResponse> {
	const url = `${trimTrailingSlash(params.apiBaseUrl)}${SESSIONS_PATH}`
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${params.accessToken}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'Idempotency-Key': params.idempotencyKey ?? createIdempotencyKey(),
		},
		body: JSON.stringify(params.body),
	})

	const rawBody: unknown = await response.json().catch(() => null)

	if (!response.ok) {
		throw new PbsApiError(
			readErrorMessage(rawBody, `Session request failed (${response.status})`),
			response.status,
			rawBody
		)
	}

	try {
		return toCreateSessionResponse(rawBody)
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Invalid session response'
		throw new PbsApiError(message, response.status, rawBody)
	}
}
