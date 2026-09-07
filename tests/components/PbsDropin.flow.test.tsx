import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdyenCheckout } from '@adyen/adyen-web'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PbsDropin } from '../../src/components/PbsDropin'

const createSessionMock = vi.fn()

vi.mock('../../src/api/createSession', () => ({
	createSession: (...args: unknown[]) => createSessionMock(...args),
}))

vi.mock('@adyen/adyen-web', () => {
	class DropinMock {
		mount = vi.fn().mockReturnThis()
		unmount = vi.fn()
	}
	return {
		AdyenCheckout: vi.fn().mockResolvedValue({}),
		Dropin: DropinMock,
		Card: {},
		PayPal: {},
		PayByBank: {},
		Bancontact: {},
		Klarna: {},
	}
})

vi.mock('@adyen/adyen-web/styles/adyen.css', () => ({}))

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
		render(<PbsDropin accessToken='token' adyenClientKey='test_key' />)

		await user.type(screen.getByLabelText(/identifiant de boutique/i), 'store-uuid')
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
})
