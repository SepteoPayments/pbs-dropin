import { DEFAULT_LOCALE } from './defaults'

export const PBS_UI_LOCALES = [
	{ id: 'fr-FR', label: 'Français', countryCode: 'FR' },
	{ id: 'en-US', label: 'English', countryCode: 'GB' },
	{ id: 'es-ES', label: 'Español', countryCode: 'ES' },
] as const

export type PbsUiLocale = (typeof PBS_UI_LOCALES)[number]['id']
export type PbsUiLanguage = 'fr' | 'en' | 'es'

export const DEFAULT_AVAILABLE_LOCALES: readonly string[] = PBS_UI_LOCALES.map(option => option.id)

export function uiLanguageFromLocale(locale: string): PbsUiLanguage {
	const language = locale.trim().toLowerCase().split('-')[0]
	if (language === 'fr' || language === 'en' || language === 'es') {
		return language
	}
	return 'en'
}

export function isPbsUiLocale(value: string): value is PbsUiLocale {
	return PBS_UI_LOCALES.some(option => option.id === value)
}

export function countryCodeFromLocale(locale: string): string {
	const option = PBS_UI_LOCALES.find(item => item.id === locale)
	if (option) {
		return option.countryCode
	}
	const language = uiLanguageFromLocale(locale)
	if (language === 'fr') return 'FR'
	if (language === 'es') return 'ES'
	return 'GB'
}

export function resolveAvailableLocales(locales: string[] | undefined): string[] {
	const cleaned = (locales ?? []).map(value => value.trim()).filter(value => value.length > 0)
	if (cleaned.length === 0) {
		return [...DEFAULT_AVAILABLE_LOCALES]
	}
	return cleaned
}

export function resolveInitialLocale(locale: string | undefined, availableLocales: string[]): string {
	const requested = locale?.trim() ?? ''
	if (requested.length > 0 && availableLocales.includes(requested)) {
		return requested
	}
	if (availableLocales.length > 0) {
		return availableLocales[0] ?? DEFAULT_LOCALE
	}
	return DEFAULT_LOCALE
}

export function localeOptionLabel(locale: string): string {
	const option = PBS_UI_LOCALES.find(item => item.id === locale)
	return option?.label ?? locale
}
