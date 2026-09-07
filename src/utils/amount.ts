const CENTS_PER_MAJOR_UNIT = 100

/** Parses the form amount in major units (100 € → 100) and returns minor units for the API (10000). */
export function majorAmountToCents(value: string): number | null {
	const normalized = value.trim().replace(',', '.')
	if (!/^\d+([.]\d{1,2})?$/.test(normalized)) {
		return null
	}
	const major = Number.parseFloat(normalized)
	if (!Number.isFinite(major) || major <= 0) {
		return null
	}
	const cents = Math.round(major * CENTS_PER_MAJOR_UNIT)
	if (cents <= 0) {
		return null
	}
	return cents
}
