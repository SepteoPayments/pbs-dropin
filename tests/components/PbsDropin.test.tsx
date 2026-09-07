import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PbsDropin } from '../../src/components/PbsDropin'

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

describe('PbsDropin', () => {
	it('renders the session form fields with French labels', () => {
		render(<PbsDropin />)
		expect(screen.getByLabelText(/jeton/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/identifiant de boutique/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /créer la session/i })).toBeInTheDocument()
		expect(screen.getByTestId('pbs-locale')).toBeInTheDocument()
		expect(screen.getByTestId('pbs-currency')).toHaveTextContent(/EUR/)
		expect(screen.getByTestId('pbs-country')).toHaveValue('')
		expect(screen.getByTestId('pbs-country')).toHaveAttribute(
			'placeholder',
			'Saisissez au moins 2 caractères pour rechercher un pays'
		)
		expect(screen.getByRole('radio', { name: /manuel/i })).toBeChecked()
		expect(screen.queryByLabelText('Scénario')).not.toBeInTheDocument()
	})

	it('hides the access-token field when the accessToken prop is provided', () => {
		render(<PbsDropin accessToken='prop-token' />)
		expect(screen.queryByLabelText(/jeton/i)).not.toBeInTheDocument()
		expect(screen.getByTestId('pbs-submit-session')).toBeEnabled()
	})

	it('hides the store field when publicStoreId is provided', () => {
		render(<PbsDropin publicStoreId='store-prop' />)
		expect(screen.queryByLabelText(/identifiant de boutique/i)).not.toBeInTheDocument()
	})

	it('hides the language selector when a single locale is provided', () => {
		render(<PbsDropin locale='en-US' locales={['en-US']} />)
		expect(screen.queryByTestId('pbs-locale')).not.toBeInTheDocument()
		expect(screen.getByRole('button', { name: /create session/i })).toBeInTheDocument()
	})

	it('keeps the language selector when several locales are available', () => {
		render(<PbsDropin locale='fr-FR' />)
		expect(screen.getByTestId('pbs-locale')).toBeInTheDocument()
	})

	it('switches form labels when the shopper picks another language', async () => {
		const user = userEvent.setup()
		render(<PbsDropin />)
		await user.click(screen.getByTestId('pbs-locale'))
		await user.click(screen.getByRole('option', { name: 'English' }))
		expect(screen.getByRole('button', { name: /create session/i })).toBeInTheDocument()
	})

	it('filters the world country list after two typed characters', async () => {
		const user = userEvent.setup()
		render(<PbsDropin />)
		const countryInput = screen.getByTestId('pbs-country')
		await user.click(countryInput)
		await user.type(countryInput, 'fr')
		const franceOption = await screen.findByRole('option', { name: /france/i })
		expect(franceOption).toBeInTheDocument()
		await user.click(franceOption)
		expect(countryInput).toHaveValue('France')
		await user.click(countryInput)
		await user.clear(countryInput)
		await user.type(countryInput, 'br')
		expect(await screen.findByRole('option', { name: /brésil|brazil/i })).toBeInTheDocument()
	})

	it('does not list countries before two characters are typed', async () => {
		const user = userEvent.setup()
		render(<PbsDropin />)
		const countryInput = screen.getByTestId('pbs-country')
		await user.click(countryInput)
		await user.type(countryInput, 'f')
		expect(screen.queryByRole('listbox', { name: /pays de l/i })).not.toBeInTheDocument()
		expect(screen.queryByText(/saisissez au moins 2 caractères/i)).not.toBeInTheDocument()
	})

	it('lets the user pick a capture mode with radios on one row', async () => {
		const user = userEvent.setup()
		render(<PbsDropin />)
		await user.click(screen.getByRole('radio', { name: /immédiat/i }))
		expect(screen.getByRole('radio', { name: /immédiat/i })).toBeChecked()
		expect(screen.getByRole('radio', { name: /différé/i })).not.toBeChecked()
		expect(screen.queryByLabelText(/délai en heures/i)).not.toBeInTheDocument()
		await user.click(screen.getByRole('radio', { name: /différé/i }))
		const delayField = screen.getByTestId('pbs-delay-hours-field')
		expect(delayField).toHaveClass('pbs-dropin__field--full')
		expect(screen.getByLabelText(/délai en heures/i)).toBeInTheDocument()
	})

	it('keeps amount left and currency right on the same row', () => {
		render(<PbsDropin />)
		const row = screen.getByTestId('pbs-amount-currency-row')
		expect(row).toContainElement(screen.getByLabelText(/^montant$/i))
		expect(row).toContainElement(screen.getByTestId('pbs-currency'))
		expect(row.children[0]).toContainElement(screen.getByLabelText(/^montant$/i))
		expect(row.children[1]).toContainElement(screen.getByTestId('pbs-currency'))
	})

	it('puts provider and reference on the same row', () => {
		render(<PbsDropin />)
		const row = screen.getByTestId('pbs-provider-reference-row')
		expect(row).toContainElement(screen.getByLabelText('Prestataire'))
		expect(row).toContainElement(screen.getByLabelText('Référence'))
	})

	it('puts pre-auth, moto and tokenization checkboxes on a wrapping row', () => {
		render(<PbsDropin />)
		const row = screen.getByTestId('pbs-checkboxes')
		expect(row).toHaveClass('pbs-dropin__checkboxes')
		expect(row).toContainElement(screen.getByRole('checkbox', { name: /pré-autorisation/i }))
		expect(row).toContainElement(screen.getByRole('checkbox', { name: /moto/i }))
		expect(row).toContainElement(screen.getByRole('checkbox', { name: /tokenisation/i }))
		expect(row.querySelectorAll('.pbs-dropin__checkbox')).toHaveLength(3)
	})

	it('places access token, store id, then return URL before capture mode', () => {
		render(<PbsDropin />)
		const token = screen.getByLabelText(/jeton/i)
		const store = screen.getByLabelText(/identifiant de boutique/i)
		const returnUrl = screen.getByLabelText(/url de retour/i)
		const capture = screen.getByTestId('pbs-capture-mode')
		expect(token.compareDocumentPosition(store) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
		expect(store.compareDocumentPosition(returnUrl) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
		expect(
			returnUrl.compareDocumentPosition(capture) & Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy()
	})

	it('uses EUR only when no currencies prop is passed', async () => {
		const user = userEvent.setup()
		render(<PbsDropin />)
		expect(screen.getByTestId('pbs-currency')).toHaveTextContent(/EUR/)
		await user.click(screen.getByTestId('pbs-currency'))
		expect(screen.getByRole('option', { name: /EUR/ })).toBeInTheDocument()
		expect(screen.queryByRole('option', { name: /GBP/ })).not.toBeInTheDocument()
	})

	it('uses the currencies prop as the select options', async () => {
		const user = userEvent.setup()
		render(<PbsDropin currencies={['EUR', 'GBP']} />)
		await user.click(screen.getByTestId('pbs-currency'))
		expect(screen.getByRole('option', { name: /GBP/ })).toBeInTheDocument()
	})

	it('hides API URL and Adyen client key when those props are provided', () => {
		render(<PbsDropin apiBaseUrl='https://example.test' adyenClientKey='test_key' />)
		expect(screen.queryByLabelText(/url de l/i)).not.toBeInTheDocument()
		expect(screen.queryByLabelText(/clé client adyen/i)).not.toBeInTheDocument()
		expect(screen.getByLabelText(/jeton/i)).toBeInTheDocument()
	})

	it('shows capture mode as three radios on one row', () => {
		render(<PbsDropin />)
		const group = screen.getByTestId('pbs-capture-mode')
		expect(group).toHaveAttribute('role', 'radiogroup')
		expect(screen.getByRole('radio', { name: 'Immédiat' })).toBeInTheDocument()
		expect(screen.getByRole('radio', { name: 'Différé' })).toBeInTheDocument()
		expect(screen.getByRole('radio', { name: 'Manuel' })).toBeChecked()
	})

	it('shows shopper reference and recurring model on one row when tokenization is enabled', async () => {
		const user = userEvent.setup()
		render(<PbsDropin />)
		expect(screen.queryByLabelText(/référence acheteur/i)).not.toBeInTheDocument()
		await user.click(screen.getByRole('checkbox', { name: /tokenisation/i }))
		const shopperReference = screen.getByLabelText(/référence acheteur/i)
		const recurringModel = screen.getByLabelText(/modèle de récurrence/i)
		expect(shopperReference).toBeInTheDocument()
		expect(recurringModel).toBeInTheDocument()
		expect(shopperReference.closest('.pbs-dropin__tokenization')).toBe(
			recurringModel.closest('.pbs-dropin__tokenization')
		)
	})

	it('shows Stripe as unavailable when selected', async () => {
		const user = userEvent.setup()
		render(<PbsDropin />)
		await user.selectOptions(screen.getByLabelText('Prestataire'), 'stripe')
		expect(screen.getByRole('status')).toHaveTextContent(/stripe n’est pas disponible/i)
		expect(screen.getByTestId('pbs-submit-session')).toBeDisabled()
	})
})
