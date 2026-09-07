export const COUNTRY_SEARCH_MIN_CHARACTERS = 2

/** Same ISO 3166-1 alpha-2 list as the BO payment-link country field. */
export const ISO_COUNTRY_CODES = [
	'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
	'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS',
	'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN',
	'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE',
	'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF',
	'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM',
	'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM',
	'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC',
	'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK',
	'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA',
	'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG',
	'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW',
	'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST',
	'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR',
	'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN',
	'VU', 'WF', 'WS', 'YE', 'YT', 'ZA', 'ZM', 'ZW',
] as const

/** Russia is hidden in the BO list (ticket #2364). */
export const EXCLUDED_COUNTRY_CODES: readonly string[] = ['RU']

export interface CountryOption {
	id: string
	label: string
}

export function normalizeCountrySearch(value: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
}

export function getDisplayableCountries(locale: string): CountryOption[] {
	const displayNames = new Intl.DisplayNames([locale], { type: 'region' })
	return ISO_COUNTRY_CODES.filter(code => !EXCLUDED_COUNTRY_CODES.includes(code))
		.map(id => ({
			id,
			label: displayNames.of(id) ?? id,
		}))
		.sort((left, right) => left.label.localeCompare(right.label, locale))
}

export function getCountryLabel(countryCode: string, locale: string): string {
	const code = countryCode.trim().toUpperCase()
	if (code.length === 0) {
		return ''
	}
	try {
		return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code
	} catch {
		return code
	}
}

export function filterCountries(
	countries: readonly CountryOption[],
	query: string,
	minCharacters = COUNTRY_SEARCH_MIN_CHARACTERS
): CountryOption[] {
	const normalized = normalizeCountrySearch(query)
	if (normalized.length < minCharacters) {
		return []
	}
	return countries.filter(
		country =>
			normalizeCountrySearch(country.label).includes(normalized) ||
			country.id.toLowerCase().includes(normalized)
	)
}
