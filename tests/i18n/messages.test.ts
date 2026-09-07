import { describe, expect, it } from 'vitest'
import { isPbsUiLocale, uiLanguageFromLocale } from '../../src/constants/locales'
import { getPbsMessages } from '../../src/i18n/messages'

describe('uiLanguageFromLocale', () => {
	it('maps BO locales to form languages', () => {
		expect(uiLanguageFromLocale('fr-FR')).toBe('fr')
		expect(uiLanguageFromLocale('en-US')).toBe('en')
		expect(uiLanguageFromLocale('es-ES')).toBe('es')
	})

	it('falls back to English for unsupported Adyen locales', () => {
		expect(uiLanguageFromLocale('de-DE')).toBe('en')
		expect(uiLanguageFromLocale('nl-NL')).toBe('en')
	})
})

describe('isPbsUiLocale', () => {
	it('accepts the selectable form locales', () => {
		expect(isPbsUiLocale('fr-FR')).toBe(true)
		expect(isPbsUiLocale('de-DE')).toBe(false)
	})
})

describe('getPbsMessages', () => {
	it('returns French, English and Spanish chrome', () => {
		expect(getPbsMessages('fr-FR').createSession).toBe('Créer la session')
		expect(getPbsMessages('en-US').createSession).toBe('Create session')
		expect(getPbsMessages('es-ES').createSession).toBe('Crear la sesión')
	})
})
