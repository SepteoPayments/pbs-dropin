import { describe, expect, it } from 'vitest'
import { validateSessionForm } from '../../src/validation/validateSessionForm'
import { createDefaultSessionForm } from '../../src/utils/defaultForm'
import type { SessionFormValues } from '../../src/types'

function form(overrides: Partial<SessionFormValues> = {}): SessionFormValues {
	return {
		...createDefaultSessionForm({}),
		accessToken: 'token',
		publicStoreId: 'store-1',
		...overrides,
	}
}

describe('validateSessionForm', () => {
	it('requires access token from field or prop', () => {
		const errors = validateSessionForm({ form: form({ accessToken: '' }) })
		expect(errors.accessToken).toBe('Le jeton d’accès est requis (champ ou prop)')

		const withProp = validateSessionForm({
			form: form({ accessToken: '' }),
			accessTokenProp: 'prop-token',
		})
		expect(withProp.accessToken).toBeUndefined()
	})

	it('requires publicStoreId from field or prop', () => {
		const errors = validateSessionForm({ form: form({ publicStoreId: '' }) })
		expect(errors.publicStoreId).toBeDefined()

		const withProp = validateSessionForm({
			form: form({ publicStoreId: '' }),
			publicStoreIdProp: 'store-prop',
		})
		expect(withProp.publicStoreId).toBeUndefined()
	})

	it('requires DELAYED delayHours', () => {
		const errors = validateSessionForm({
			form: form({ captureMode: 'DELAYED', captureDelayHours: '' }),
		})
		expect(errors.captureDelayHours).toBeDefined()
	})

	it('translates validation errors from the locale', () => {
		const errors = validateSessionForm({
			form: form({ accessToken: '', locale: 'en-US' }),
			locale: 'en-US',
		})
		expect(errors.accessToken).toBe('Access token is required (field or prop)')
	})

	it('requires returnUrl', () => {
		const errors = validateSessionForm({ form: form({ returnUrl: '' }) })
		expect(errors.returnUrl).toBeDefined()
	})

	it('requires shopperReference when tokenization is on', () => {
		const errors = validateSessionForm({
			form: form({ tokenizationEnabled: true, shopperReference: '' }),
		})
		expect(errors.shopperReference).toBeDefined()
	})

	it('accepts a valid form', () => {
		const errors = validateSessionForm({ form: form() })
		expect(errors).toEqual({})
	})
})
