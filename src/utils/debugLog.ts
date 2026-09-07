import { PBS_DROPIN_DEBUG_TAG } from '../constants/defaults'

export function debugLog(message: string, data?: unknown): void {
	if (data !== undefined) {
		console.debug(`[${PBS_DROPIN_DEBUG_TAG}] ${message}`, data)
		return
	}
	console.debug(`[${PBS_DROPIN_DEBUG_TAG}] ${message}`)
}
