import { describe, expect, it } from 'vitest'
import { applySessionFormChange } from '../../src/utils/applySessionFormChange'
import { createDefaultSessionForm } from '../../src/utils/defaultForm'
import { dropinTestProps } from '../helpers/dropinProps'

describe('applySessionFormChange', () => {
	it('switches capture to MANUAL when preAuth is checked', () => {
		const previous = createDefaultSessionForm(dropinTestProps())
		expect(previous.captureMode).toBe('IMMEDIATE')

		const next = applySessionFormChange(previous, 'preAuth', true)
		expect(next.preAuth).toBe(true)
		expect(next.captureMode).toBe('MANUAL')
	})

	it('does not auto-check preAuth when MANUAL is selected', () => {
		const previous = createDefaultSessionForm(dropinTestProps())
		const next = applySessionFormChange(previous, 'captureMode', 'MANUAL')
		expect(next.captureMode).toBe('MANUAL')
		expect(next.preAuth).toBe(false)
	})

	it('clears preAuth when capture is IMMEDIATE or DELAYED', () => {
		const previous = {
			...createDefaultSessionForm(dropinTestProps()),
			captureMode: 'MANUAL' as const,
			preAuth: true,
		}

		expect(applySessionFormChange(previous, 'captureMode', 'IMMEDIATE').preAuth).toBe(false)
		expect(applySessionFormChange(previous, 'captureMode', 'DELAYED').preAuth).toBe(false)
	})
})
