import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSession } from '../../src/api/createSession'
import { PbsApiError } from '../../src/api/errors'

const fetchMock = vi.fn<typeof fetch>()

describe('createSession', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		fetchMock.mockReset()
	})

	it('posts JSON with a Bearer token', async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({
					sessionRequestId: 'req',
					status: 'CREATED',
					publicSessionId: 'pub',
					clientSession: { id: 'id', sessionData: 'data' },
					expiresAt: '2030-01-01T00:00:00Z',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			)
		)
		vi.stubGlobal('fetch', fetchMock)

		const body = {
			amount: { value: 1000, currency: 'EUR' },
			reference: 'ref-1',
			publicStoreId: 'store-1',
			returnUrl: 'https://exemple.fr/retour',
			capture: { mode: 'MANUAL' as const },
			tokenization: null,
			moto: false,
			preAuth: false,
		}

		const created = await createSession({
			apiBaseUrl: 'https://septeo-payments-public-api-sandbox.septeo.fr/',
			accessToken: 'token-123',
			body,
		})

		expect(created.clientSession).toEqual({ id: 'id', sessionData: 'data' })
		expect(created.sessionId).toBe('pub')
		expect(created.publicSessionId).toBe('pub')

		expect(fetchMock).toHaveBeenCalledTimes(1)
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
		expect(url).toBe(
			'https://septeo-payments-public-api-sandbox.septeo.fr/api/public/v1/sessions'
		)
		expect(init.method).toBe('POST')
		expect(init.headers).toEqual(
			expect.objectContaining({
				Authorization: 'Bearer token-123',
				'Content-Type': 'application/json',
				'Idempotency-Key': expect.stringMatching(
					/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
				),
			})
		)
		expect(JSON.parse(String(init.body))).toEqual(body)
	})

	it('parses a JSON-string clientSession from the API', async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({
					sessionRequestId: 'req',
					status: 'CREATED',
					sessionId: 'sid',
					clientSession: JSON.stringify({ id: 'CS1', sessionData: 'Ab02' }),
					expiresAt: '2030-01-01T00:00:00Z',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			)
		)
		vi.stubGlobal('fetch', fetchMock)

		const created = await createSession({
			apiBaseUrl: 'https://example.test',
			accessToken: 'token-123',
			body: {
				amount: { value: 1000, currency: 'EUR' },
				reference: 'ref-1',
				publicStoreId: 'store-1',
				returnUrl: 'https://exemple.fr/retour',
				capture: { mode: 'MANUAL' },
				tokenization: null,
				moto: false,
				preAuth: false,
			},
		})

		expect(created.sessionId).toBe('sid')
		expect(created.clientSession).toEqual({ id: 'CS1', sessionData: 'Ab02' })
	})

	it('sends a provided Idempotency-Key', async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({
					sessionRequestId: 'req',
					status: 'CREATED',
					publicSessionId: 'pub',
					clientSession: { id: 'id', sessionData: 'data' },
					expiresAt: '2030-01-01T00:00:00Z',
				}),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			)
		)
		vi.stubGlobal('fetch', fetchMock)

		await createSession({
			apiBaseUrl: 'https://example.test',
			accessToken: 'token-123',
			idempotencyKey: 'fixed-key-1',
			body: {
				amount: { value: 1000, currency: 'EUR' },
				reference: 'ref-1',
				publicStoreId: 'store-1',
				returnUrl: 'https://exemple.fr/retour',
				capture: { mode: 'MANUAL' },
				tokenization: null,
				moto: false,
				preAuth: false,
			},
		})

		const init = fetchMock.mock.calls[0]?.[1] as RequestInit
		expect(init.headers).toEqual(
			expect.objectContaining({
				'Idempotency-Key': 'fixed-key-1',
			})
		)
	})

	it('throws PbsApiError on 4xx', async () => {
		fetchMock.mockResolvedValue(
			new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 })
		)
		vi.stubGlobal('fetch', fetchMock)

		await expect(
			createSession({
				apiBaseUrl: 'https://example.test',
				accessToken: 'bad',
				body: {
					amount: { value: 1, currency: 'EUR' },
					reference: 'r',
					publicStoreId: 's',
					returnUrl: 'https://exemple.fr/retour',
					capture: { mode: 'MANUAL' },
					tokenization: null,
					moto: false,
					preAuth: false,
				},
			})
		).rejects.toEqual(expect.any(PbsApiError))
	})

	it('prefers API error text over a path-like message', async () => {
		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify({
					status: 400,
					error: "Required header 'Idempotency-Key' is missing",
					message: '/api/public/v1/sessions',
				}),
				{ status: 400 }
			)
		)
		vi.stubGlobal('fetch', fetchMock)

		try {
			await createSession({
				apiBaseUrl: 'https://example.test',
				accessToken: 'token',
				body: {
					amount: { value: 1, currency: 'EUR' },
					reference: 'r',
					publicStoreId: 's',
					returnUrl: 'https://exemple.fr/retour',
					capture: { mode: 'MANUAL' },
					tokenization: null,
					moto: false,
					preAuth: false,
				},
			})
			throw new Error('expected createSession to reject')
		} catch (error: unknown) {
			expect(error).toBeInstanceOf(PbsApiError)
			expect((error as PbsApiError).message).toBe("Required header 'Idempotency-Key' is missing")
			expect((error as PbsApiError).status).toBe(400)
		}
	})
})
