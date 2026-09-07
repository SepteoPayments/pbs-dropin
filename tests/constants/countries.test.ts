import { describe, expect, it } from 'vitest'
import {
	EXCLUDED_COUNTRY_CODES,
	filterCountries,
	getCountryLabel,
	getDisplayableCountries,
	ISO_COUNTRY_CODES,
} from '../../src/constants/countries'

describe('full country catalog', () => {
	it('includes Norway, Brazil and Israel and hides Russia in the displayable list', () => {
		expect(ISO_COUNTRY_CODES).toContain('NO')
		expect(ISO_COUNTRY_CODES).toContain('BR')
		expect(ISO_COUNTRY_CODES).toContain('IL')
		expect(ISO_COUNTRY_CODES).toContain('RU')
		expect(EXCLUDED_COUNTRY_CODES).toContain('RU')
		expect(getDisplayableCountries('fr-FR').map(country => country.id)).not.toContain('RU')
	})
})

describe('country options', () => {
	it('translates country names with the form locale', () => {
		expect(getCountryLabel('FR', 'fr-FR')).toBe('France')
		expect(getCountryLabel('DE', 'en-US')).toBe('Germany')
	})

	it('hides options until two characters are typed', () => {
		const options = getDisplayableCountries('fr-FR')
		expect(filterCountries(options, 'f')).toEqual([])
		expect(filterCountries(options, 'fr').some(option => option.id === 'FR')).toBe(true)
	})
})
