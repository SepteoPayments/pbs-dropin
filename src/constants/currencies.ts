import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_OPTIONS } from './defaults'

/** Mapping ISO 4217 → ISO 3166-1 alpha-2 for flags (same as the BO catalog). */
export const CURRENCY_TO_COUNTRY_CODE: Readonly<Record<string, string>> = {
	EUR: 'EU',
	GBP: 'GB',
	USD: 'US',
	CHF: 'CH',
	PLN: 'PL',
	DKK: 'DK',
}

export function getCurrencyLabel(currencyCode: string, locale: string): string {
	const code = currencyCode.trim().toUpperCase()
	if (code.length === 0) {
		return ''
	}
	try {
		const name = new Intl.DisplayNames([locale], { type: 'currency' }).of(code) ?? code
		const pretty = name.charAt(0).toUpperCase() + name.slice(1)
		return `${code} · ${pretty}`
	} catch {
		return code
	}
}

export function getCountryCodeForCurrency(currencyCode: string): string | null {
	const code = currencyCode.trim().toUpperCase()
	if (code.length === 0) {
		return null
	}
	return CURRENCY_TO_COUNTRY_CODE[code] ?? null
}

export function resolveCurrencyOptions(currencies: string[] | undefined): string[] {
	const cleaned = (currencies ?? [])
		.map(value => value.trim().toUpperCase())
		.filter(value => value.length > 0)
	if (cleaned.length === 0) {
		return [...DEFAULT_CURRENCY_OPTIONS]
	}
	return cleaned
}

export function resolveInitialCurrency(
	currency: string | undefined,
	currencyOptions: string[]
): string {
	const requested = currency?.trim().toUpperCase() ?? ''
	if (requested.length > 0 && currencyOptions.includes(requested)) {
		return requested
	}
	return currencyOptions[0] ?? DEFAULT_CURRENCY
}
