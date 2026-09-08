import type { SessionFormValues } from '../types'

export function applySessionFormChange<K extends keyof SessionFormValues>(
	previous: SessionFormValues,
	key: K,
	value: SessionFormValues[K]
): SessionFormValues {
	const next: SessionFormValues = { ...previous, [key]: value }

	if (key === 'preAuth' && value === true) {
		next.captureMode = 'MANUAL'
	}

	if (key === 'captureMode' && value !== 'MANUAL') {
		next.preAuth = false
	}

	return next
}
