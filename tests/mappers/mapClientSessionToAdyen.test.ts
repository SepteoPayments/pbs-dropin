import { describe, expect, it } from 'vitest'
import { mapClientSessionToAdyen } from '../../src/mappers/mapClientSessionToAdyen'
import type { CreateSessionResponse } from '../../src/types'

function response(overrides: Partial<CreateSessionResponse> = {}): CreateSessionResponse {
	return {
		sessionRequestId: 'req-1',
		status: 'CREATED',
		sessionId: 'pub-1',
		publicSessionId: 'pub-1',
		clientSession: { id: 'cs-1', sessionData: 'data-1' },
		expiresAt: '2030-01-01T00:00:00Z',
		...overrides,
	}
}

describe('mapClientSessionToAdyen', () => {
	it('maps clientSession id and sessionData', () => {
		expect(mapClientSessionToAdyen(response())).toEqual({ id: 'cs-1', sessionData: 'data-1' })
	})

	it('parses clientSession when the API returns a JSON string', () => {
		const mapped = mapClientSessionToAdyen(
			response({
				clientSession: JSON.stringify({ id: 'CS123', sessionData: 'Ab02b4c' }),
			})
		)
		expect(mapped).toEqual({ id: 'CS123', sessionData: 'Ab02b4c' })
	})
})
