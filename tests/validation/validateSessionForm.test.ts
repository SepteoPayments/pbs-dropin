import { describe, expect, it } from 'vitest'
import { validateSessionForm } from '../../src/validation/validateSessionForm'
import { createDefaultSessionForm } from '../../src/utils/defaultForm'
import type { SessionFormValues } from '../../src/types'
import { dropinTestProps } from '../helpers/dropinProps'

function form(overrides: Partial<SessionFormValues> = {}): SessionFormValues {
	return {
		...createDefaultSessionForm(dropinTestProps()),
		shopperCountryCode: 'FR',
		...overrides,
	}
}

describe('validateSessionForm', () => {
	it('requires the access token prop', () => {
		const errors = validateSessionForm({
			form: form(),
			accessToken: '',
			publicStoreId: 'store-1',
			returnUrl: 'https://exemple.fr/retour',
		})
		expect(errors.accessToken).toBe('Le jeton d’accès est requis')
	})

	it('requires publicStoreId from the prop', () => {
		const errors = validateSessionForm({
			form: form(),
			accessToken: 'token',
			publicStoreId: '',
			returnUrl: 'https://exemple.fr/retour',
		})
		expect(errors.publicStoreId).toBeDefined()
	})

	it('requires DELAYED delayHours', () => {
		const errors = validateSessionForm({
			form: form({ captureMode: 'DELAYED', captureDelayHours: '' }),
			accessToken: 'token',
			publicStoreId: 'store-1',
			returnUrl: 'https://exemple.fr/retour',
		})
		expect(errors.captureDelayHours).toBeDefined()
	})

	it('translates validation errors from the locale', () => {
		const errors = validateSessionForm({
			form: form({ locale: 'en-US' }),
			accessToken: '',
			publicStoreId: 'store-1',
			returnUrl: 'https://exemple.fr/retour',
			locale: 'en-US',
		})
		expect(errors.accessToken).toBe('Access token is required')
	})

	it('requires returnUrl from the prop', () => {
		const errors = validateSessionForm({
			form: form(),
			accessToken: 'token',
			publicStoreId: 'store-1',
			returnUrl: '',
		})
		expect(errors.returnUrl).toBeDefined()
	})

	it('requires amount, currency, reference and shopper country', () => {
		const errors = validateSessionForm({
			form: form({
				amount: '',
				currency: '',
				reference: '',
				shopperCountryCode: '',
			}),
			accessToken: 'token',
			publicStoreId: 'store-1',
			returnUrl: 'https://exemple.fr/retour',
		})
		expect(errors.amount).toBe('Le montant est requis')
		expect(errors.currency).toBe('La devise est requise')
		expect(errors.reference).toBe('La référence est requise')
		expect(errors.shopperCountryCode).toBe('Le pays de l’acheteur est requis')
	})

	it('requires shopperReference and recurring model when tokenization is on', () => {
		const errors = validateSessionForm({
			form: form({
				tokenizationEnabled: true,
				shopperReference: '',
				recurringModel: '' as SessionFormValues['recurringModel'],
			}),
			accessToken: 'token',
			publicStoreId: 'store-1',
			returnUrl: 'https://exemple.fr/retour',
		})
		expect(errors.shopperReference).toBeDefined()
		expect(errors.recurringModel).toBeDefined()
	})

	it('does not require shopperReference or recurring model when tokenization is off', () => {
		const errors = validateSessionForm({
			form: form({
				tokenizationEnabled: false,
				shopperReference: '',
				recurringModel: '' as SessionFormValues['recurringModel'],
			}),
			accessToken: 'token',
			publicStoreId: 'store-1',
			returnUrl: 'https://exemple.fr/retour',
		})
		expect(errors.shopperReference).toBeUndefined()
		expect(errors.recurringModel).toBeUndefined()
	})

	it('accepts a valid form', () => {
		const errors = validateSessionForm({
			form: form(),
			accessToken: 'token',
			publicStoreId: 'store-1',
			returnUrl: 'https://exemple.fr/retour',
		})
		expect(errors).toEqual({})
	})
})
