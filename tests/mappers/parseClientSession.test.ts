import { describe, expect, it } from 'vitest'
import { parseClientSession } from '../../src/mappers/parseClientSession'
import { toCreateSessionResponse } from '../../src/mappers/toCreateSessionResponse'

describe('parseClientSession', () => {
	it('accepts an object', () => {
		expect(parseClientSession({ id: 'CS1', sessionData: 'data' })).toEqual({
			id: 'CS1',
			sessionData: 'data',
		})
	})

	it('parses a JSON string from the public API', () => {
		expect(parseClientSession('{"id":"CS1","sessionData":"data"}')).toEqual({
			id: 'CS1',
			sessionData: 'data',
		})
	})

	it('rejects a string that is not JSON', () => {
		expect(() => parseClientSession('not-json')).toThrow('clientSession is not valid JSON')
	})
})

describe('toCreateSessionResponse', () => {
	it('normalizes sessionId and a JSON-string clientSession', () => {
		const response = toCreateSessionResponse({
			sessionRequestId: 'req-1',
			status: 'CREATED',
			sessionId: 'sid-1',
			clientSession: '{"id":"CS1","sessionData":"data"}',
			expiresAt: '2030-01-01T00:00:00Z',
		})
		expect(response.sessionId).toBe('sid-1')
		expect(response.publicSessionId).toBe('sid-1')
		expect(response.clientSession).toEqual({ id: 'CS1', sessionData: 'data' })
	})
})
