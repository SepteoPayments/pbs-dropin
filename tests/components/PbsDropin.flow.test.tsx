import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdyenCheckout } from '@adyen/adyen-web/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PbsDropin } from '../../src/components/PbsDropin'
import { dropinTestProps } from '../helpers/dropinProps'

const createSessionMock = vi.fn()

vi.mock('../../src/api/createSession', () => ({
	createSession: (...args: unknown[]) => createSessionMock(...args),
}))

vi.mock('@adyen/adyen-web/auto', () => {
	class DropinMock {
		mount = vi.fn().mockReturnThis()
		unmount = vi.fn()
	}
	return {
		AdyenCheckout: vi.fn().mockResolvedValue({}),
		Dropin: DropinMock,
	}
})

vi.mock('@adyen/adyen-web/styles/adyen.css', () => ({}))

async function selectFrance(user: ReturnType<typeof userEvent.setup>) {
	await user.click(screen.getByTestId('pbs-country'))
	await user.type(screen.getByTestId('pbs-country'), 'fr')
	await user.click(screen.getByRole('option', { name: /france/i }))
}

describe('PbsDropin session flow', () => {
	beforeEach(() => {
		createSessionMock.mockReset()
		createSessionMock.mockResolvedValue({
			sessionRequestId: 'req',
			status: 'CREATED',
			publicSessionId: 'pub',
			clientSession: { id: 'cs-1', sessionData: 'session-data' },
			expiresAt: '2030-01-01T00:00:00Z',
		})
		vi.mocked(AdyenCheckout).mockClear()
	})

	it('creates a session then mounts the Adyen container', async () => {
		const user = userEvent.setup()
		render(<PbsDropin {...dropinTestProps()} />)

		await selectFrance(user)
		await user.click(screen.getByTestId('pbs-submit-session'))

		await waitFor(() => {
			expect(createSessionMock).toHaveBeenCalled()
		})
		expect(await screen.findByTestId('pbs-adyen-dropin')).toBeInTheDocument()
		await waitFor(() => {
			expect(AdyenCheckout).toHaveBeenCalledWith(
				expect.objectContaining({ locale: 'fr-FR', countryCode: 'FR' })
			)
		})
		expect(screen.getByTestId('pbs-reset-session')).toBeInTheDocument()
		await user.click(screen.getByTestId('pbs-reset-session'))
		expect(screen.queryByTestId('pbs-adyen-dropin')).not.toBeInTheDocument()
		expect(screen.getByTestId('pbs-submit-session')).toBeEnabled()
	})

	it('sends lineItems when Klarna / BNPL is checked and a country is selected', async () => {
		const user = userEvent.setup()
		render(<PbsDropin {...dropinTestProps()} />)

		await user.click(screen.getByRole('checkbox', { name: /klarna \/ bnpl/i }))
		await selectFrance(user)
		await user.click(screen.getByTestId('pbs-submit-session'))

		await waitFor(() => {
			expect(createSessionMock).toHaveBeenCalledWith(
				expect.objectContaining({
					body: expect.objectContaining({
						shopperCountryCode: 'FR',
						lineItems: [
							{
								id: 'SKU-1',
								description: 'Article de test (requis pour afficher Klarna/BNPL)',
								quantity: 1,
								amountIncludingTax: 1000,
							},
						],
					}),
				})
			)
		})
	})
})
