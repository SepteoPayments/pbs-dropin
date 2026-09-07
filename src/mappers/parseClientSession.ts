import type { ClientSession } from '../types'

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseJsonObject(raw: string): unknown {
	try {
		return JSON.parse(raw) as unknown
	} catch {
		throw new Error('clientSession is not valid JSON')
	}
}

export function parseClientSession(raw: unknown): ClientSession {
	const value: unknown = typeof raw === 'string' ? parseJsonObject(raw) : raw
	if (!isRecord(value)) {
		throw new Error('clientSession is missing from the session response')
	}

	const id = value['id']
	const sessionData = value['sessionData']
	if (typeof id !== 'string' || id.length === 0) {
		throw new Error('clientSession.id is missing')
	}
	if (typeof sessionData !== 'string' || sessionData.length === 0) {
		throw new Error('clientSession.sessionData is missing')
	}

	return { id, sessionData }
}
