# pbs-dropin

React drop-in for the Septeo Payments public session API and the Adyen widget.

This is an early `0.1.0` release. Field layout and product rules may still change.

## Install

```bash
npm install pbs-dropin @adyen/adyen-web
```

Peer dependencies: `react` (>=18), `react-dom` (>=18), `@adyen/adyen-web` (^6).

## Usage

```tsx
import { PbsDropin } from 'pbs-dropin'
import 'pbs-dropin/styles'

export function Checkout() {
	return (
		<PbsDropin
			apiBaseUrl='https://septeo-payments-public-api-sandbox.septeo.fr'
			adyenClientKey='test_…'
			adyenEnvironment='test'
			locale='fr-FR'
		/>
	)
}
```

If `accessToken` or `publicStoreId` are omitted, the form shows those fields so the tester can paste them.

## Scripts

```bash
npm test
npm run type-check
npm run build
```
