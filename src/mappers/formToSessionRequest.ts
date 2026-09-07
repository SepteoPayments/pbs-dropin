import type { CreateSessionRequest, SessionFormValues } from '../types'
import { majorAmountToCents } from '../utils/amount'

export function formToSessionRequest(form: SessionFormValues): CreateSessionRequest {
	const amountValue = majorAmountToCents(form.amount)
	if (amountValue === null) {
		throw new Error('Invalid amount')
	}

	const capture: CreateSessionRequest['capture'] = { mode: form.captureMode }
	if (form.captureMode === 'DELAYED') {
		capture.delayHours = Number.parseInt(form.captureDelayHours, 10)
	}

	const tokenization = form.tokenizationEnabled
		? {
				shopperReference: form.shopperReference.trim(),
				recurringModel: form.recurringModel,
			}
		: null

	const request: CreateSessionRequest = {
		amount: {
			value: amountValue,
			currency: form.currency.trim().toUpperCase(),
		},
		reference: form.reference.trim(),
		publicStoreId: form.publicStoreId.trim(),
		returnUrl: form.returnUrl.trim(),
		capture,
		tokenization,
		moto: form.moto,
		preAuth: form.preAuth,
	}

	const country = form.shopperCountryCode.trim().toUpperCase()
	if (country.length > 0) {
		request.shopperCountryCode = country
	}

	return request
}
