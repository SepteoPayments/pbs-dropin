import { describe, expect, it } from 'vitest'
import { majorAmountToCents } from '../../src/utils/amount'
import { isProvidedProp, resolveHybridValue } from '../../src/utils/hybridValue'

describe('majorAmountToCents', () => {
	it('converts major units to cents', () => {
		expect(majorAmountToCents('100')).toBe(10000)
		expect(majorAmountToCents('10')).toBe(1000)
		expect(majorAmountToCents('10.5')).toBe(1050)
		expect(majorAmountToCents('10,50')).toBe(1050)
	})

	it('rejects zero, invalid and empty values', () => {
		expect(majorAmountToCents('0')).toBeNull()
		expect(majorAmountToCents('')).toBeNull()
		expect(majorAmountToCents('abc')).toBeNull()
		expect(majorAmountToCents('10.555')).toBeNull()
	})
})

describe('resolveHybridValue', () => {
	it('prefers a filled field over the prop', () => {
		expect(resolveHybridValue(' field-token ', 'prop-token')).toBe('field-token')
	})

	it('falls back to the prop when the field is empty', () => {
		expect(resolveHybridValue('  ', 'prop-token')).toBe('prop-token')
	})
})

describe('isProvidedProp', () => {
	it('is true only for a non-empty trimmed value', () => {
		expect(isProvidedProp('token')).toBe(true)
		expect(isProvidedProp('  ')).toBe(false)
		expect(isProvidedProp(undefined)).toBe(false)
	})
})
