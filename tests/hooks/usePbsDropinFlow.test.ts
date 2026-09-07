import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePbsDropinFlow } from '../../src/hooks/usePbsDropinFlow'

const createSessionMock = vi.fn()

vi.mock('../../src/api/createSession', () => ({
	createSession: (...args: unknown[]) => createSessionMock(...args),
}))

describe('usePbsDropinFlow', () => {
	beforeEach(() => {
		createSessionMock.mockReset()
	})

	it('uses the prop token when the field is empty', async () => {
		createSessionMock.mockResolvedValue({
			sessionRequestId: 'req',
			status: 'CREATED',
			publicSessionId: 'pub',
			clientSession: { id: 'id', sessionData: 'data' },
			expiresAt: '2030-01-01T00:00:00Z',
		})

		const { result } = renderHook(() => usePbsDropinFlow({ accessToken: 'prop-token' }))

		act(() => {
			result.current.updateField('accessToken', '')
			result.current.updateField('publicStoreId', 'store-1')
		})

		await act(async () => {
			await result.current.submit()
		})

		await waitFor(() => {
			expect(createSessionMock).toHaveBeenCalledWith(
				expect.objectContaining({ accessToken: 'prop-token' })
			)
		})
		expect(result.current.status).toBe('ready')
	})

	it('lets the field override the prop token', async () => {
		createSessionMock.mockResolvedValue({
			sessionRequestId: 'req',
			status: 'CREATED',
			publicSessionId: 'pub',
			clientSession: { id: 'id', sessionData: 'data' },
			expiresAt: '2030-01-01T00:00:00Z',
		})

		const { result } = renderHook(() => usePbsDropinFlow({ accessToken: 'prop-token' }))

		act(() => {
			result.current.updateField('accessToken', 'field-token')
			result.current.updateField('publicStoreId', 'store-1')
		})

		await act(async () => {
			await result.current.submit()
		})

		await waitFor(() => {
			expect(createSessionMock).toHaveBeenCalledWith(
				expect.objectContaining({ accessToken: 'field-token' })
			)
		})
	})

	it('exposes API errors', async () => {
		createSessionMock.mockRejectedValue(new Error('boom'))

		const { result } = renderHook(() => usePbsDropinFlow({ accessToken: 'token' }))

		act(() => {
			result.current.updateField('publicStoreId', 'store-1')
		})

		await act(async () => {
			await result.current.submit()
		})

		await waitFor(() => {
			expect(result.current.status).toBe('error')
		})
		expect(result.current.submitError).toBe('boom')
	})

	it('uses the publicStoreId prop when the field is empty', async () => {
		createSessionMock.mockResolvedValue({
			sessionRequestId: 'req',
			status: 'CREATED',
			publicSessionId: 'pub',
			clientSession: { id: 'id', sessionData: 'data' },
			expiresAt: '2030-01-01T00:00:00Z',
		})

		const { result } = renderHook(() =>
			usePbsDropinFlow({ accessToken: 'token', publicStoreId: 'store-prop' })
		)

		await act(async () => {
			await result.current.submit()
		})

		await waitFor(() => {
			expect(createSessionMock).toHaveBeenCalledWith(
				expect.objectContaining({
					body: expect.objectContaining({ publicStoreId: 'store-prop' }),
				})
			)
		})
	})

	it('freezes a single locale and hides the selector', () => {
		const { result } = renderHook(() => usePbsDropinFlow({ locales: ['es-ES'] }))
		expect(result.current.locale).toBe('es-ES')
		expect(result.current.showLanguageSelector).toBe(false)
	})

	it('falls back to EUR only when currencies are omitted', () => {
		const { result } = renderHook(() => usePbsDropinFlow({}))
		expect(result.current.currencyOptions).toEqual(['EUR'])
		expect(result.current.form.currency).toBe('EUR')
	})

	it('uses the locale prop as the Adyen locale by default', () => {
		const { result } = renderHook(() => usePbsDropinFlow({ locale: 'en-US' }))
		expect(result.current.locale).toBe('en-US')
		expect(result.current.form.locale).toBe('en-US')
	})

	it('lets the language field override the locale prop', () => {
		const { result } = renderHook(() => usePbsDropinFlow({ locale: 'en-US' }))

		act(() => {
			result.current.updateField('locale', 'es-ES')
		})

		expect(result.current.locale).toBe('es-ES')
	})
})
