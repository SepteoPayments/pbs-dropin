import type { CreateSessionResponse } from '../types'
import { parseClientSession } from './parseClientSession'

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredString(value: unknown, fieldName: string): string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`${fieldName} is missing from the session response`)
	}
	return value
}

function optionalString(value: unknown): string | undefined {
	if (typeof value !== 'string' || value.length === 0) {
		return undefined
	}
	return value
}

export function toCreateSessionResponse(raw: unknown): CreateSessionResponse {
	if (!isRecord(raw)) {
		throw new Error('Session response is not a JSON object')
	}

	const sessionId = optionalString(raw['sessionId']) ?? optionalString(raw['publicSessionId']) ?? ''

	return {
		sessionRequestId: requiredString(raw['sessionRequestId'], 'sessionRequestId'),
		status: requiredString(raw['status'], 'status'),
		sessionId,
		publicSessionId: sessionId,
		clientSession: parseClientSession(raw['clientSession']),
		expiresAt: requiredString(raw['expiresAt'], 'expiresAt'),
	}
}
