# pbs-dropin

React drop-in for the Septeo Payments public session API and the Adyen widget.

This is an early `0.1.1` release. Field layout and product rules may still change.

## Install

```bash
npm install pbs-dropin @adyen/adyen-web
```

Peer dependencies: `react` (>=18), `react-dom` (>=18), `@adyen/adyen-web` (^6).

The widget loads Adyen Web 6 in **auto** mode (`@adyen/adyen-web/auto`): every payment method Adyen returns on the session is shown. Do not pass a `paymentMethodComponents` allow-list, or methods activated on the store (SEPA, ANCV, wallets, …) stay hidden.

## Usage

`accessToken`, `publicStoreId` and `returnUrl` are required props. The drop-in does not display those fields: your PMS must obtain them (Hydra token, store id, return URL) and pass them in.

Klarna / BNPL only appear in the Adyen session when `lineItems` **and** `shopperCountryCode` are sent. Pass a real basket via the `lineItems` prop, or tick **Klarna / BNPL** in the test form (one synthetic line matching the amount). Shopper country is always required so Adyen can filter methods (SEPA, etc.).

Default capture is **Immediate**. Pre-authorisation is only documented with **Manual** capture: ticking pre-auth switches capture to Manual; Immediate or Delayed clears pre-auth. Manual capture without pre-auth remains valid (authorize now, capture later).

`consentMode` (`ASK_FOR_CONSENT` | `FORCED`) is optional. When omitted, the test form chooses it under Tokenization (default `ASK_FOR_CONSENT`). When passed as a prop, the control is hidden and that value is sent.

```tsx
import { PbsDropin } from 'pbs-dropin'
import 'pbs-dropin/styles'

export function Checkout() {
	return (
		<PbsDropin
			accessToken={hydraAccessToken}
			publicStoreId={publicStoreId}
			returnUrl='https://votre-pms.fr/retour'
			apiBaseUrl='https://septeo-payments-public-api-sandbox.septeo.fr'
			adyenClientKey='test_…'
			adyenEnvironment='test'
			locale='fr-FR'
			lineItems={[
				{
					id: 'SKU-1',
					description: 'Massage 60 min',
					quantity: 1,
					amountIncludingTax: 10000,
				},
			]}
		/>
	)
}
```

## Scripts

```bash
npm test
npm run type-check
npm run build
```
