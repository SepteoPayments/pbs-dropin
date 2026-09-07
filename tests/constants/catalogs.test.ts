import { describe, expect, it } from 'vitest'
import { resolveCurrencyOptions, getCurrencyLabel } from '../../src/constants/currencies'
import { resolveAvailableLocales, resolveInitialLocale } from '../../src/constants/locales'

describe('resolveCurrencyOptions', () => {
	it('falls back to EUR only when nothing is provided', () => {
		expect(resolveCurrencyOptions(undefined)).toEqual(['EUR'])
		expect(resolveCurrencyOptions([])).toEqual(['EUR'])
	})

	it('keeps the integrator list', () => {
		expect(resolveCurrencyOptions(['eur', 'GBP'])).toEqual(['EUR', 'GBP'])
	})
})

describe('getCurrencyLabel', () => {
	it('prefixes the ISO code with a localized name', () => {
		expect(getCurrencyLabel('EUR', 'fr-FR')).toMatch(/^EUR · /)
		expect(getCurrencyLabel('GBP', 'en-US').toLowerCase()).toContain('pound')
	})
})

describe('resolveAvailableLocales', () => {
	it('defaults to the three BO languages', () => {
		expect(resolveAvailableLocales(undefined)).toEqual(['fr-FR', 'en-US', 'es-ES'])
	})

	it('uses the integrator list', () => {
		expect(resolveAvailableLocales(['en-US'])).toEqual(['en-US'])
	})
})

describe('resolveInitialLocale', () => {
	it('uses the requested locale when it is available', () => {
		expect(resolveInitialLocale('en-US', ['fr-FR', 'en-US'])).toBe('en-US')
	})

	it('falls back to the first available locale', () => {
		expect(resolveInitialLocale('de-DE', ['es-ES'])).toBe('es-ES')
	})
})
