import { describe, expect, it } from 'vitest'
import { formToSessionRequest } from '../../src/mappers/formToSessionRequest'
import { createDefaultSessionForm } from '../../src/utils/defaultForm'
import type { SessionFormValues } from '../../src/types'

function form(overrides: Partial<SessionFormValues> = {}): SessionFormValues {
	return {
		...createDefaultSessionForm({}),
		publicStoreId: 'store-1',
		...overrides,
	}
}

describe('formToSessionRequest', () => {
	it('maps major units to cents in the session payload', () => {
		const request = formToSessionRequest(form({ amount: '100', captureMode: 'MANUAL' }))
		expect(request.amount).toEqual({ value: 10000, currency: 'EUR' })
		expect(request.capture).toEqual({ mode: 'MANUAL' })
		expect(request.tokenization).toBeNull()
		expect(request.moto).toBe(false)
		expect(request.preAuth).toBe(false)
		expect(request.publicStoreId).toBe('store-1')
		expect(request.reference).toBe('test-session-001')
	})

	it('adds delayHours when capture is DELAYED', () => {
		const request = formToSessionRequest(
			form({ captureMode: 'DELAYED', captureDelayHours: '48' })
		)
		expect(request.capture).toEqual({ mode: 'DELAYED', delayHours: 48 })
	})

	it('maps tokenization when enabled', () => {
		const request = formToSessionRequest(
			form({
				tokenizationEnabled: true,
				shopperReference: 'shopper-42',
				recurringModel: 'SUBSCRIPTION',
			})
		)
		expect(request.tokenization).toEqual({
			shopperReference: 'shopper-42',
			recurringModel: 'SUBSCRIPTION',
		})
	})

	it('omits empty shopperCountryCode', () => {
		const request = formToSessionRequest(form({ shopperCountryCode: '  ' }))
		expect(request.shopperCountryCode).toBeUndefined()
	})

	it('omits locale from the public session payload', () => {
		const request = formToSessionRequest(form({ locale: 'en-US' }))
		expect(request).not.toHaveProperty('locale')
		expect(request).not.toHaveProperty('shopperLocale')
	})
})
