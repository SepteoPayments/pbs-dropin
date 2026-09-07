import { getPbsMessages } from '../i18n/messages'
import type { SessionFormValues } from '../types'
import { majorAmountToCents } from '../utils/amount'
import { resolveHybridValue } from '../utils/hybridValue'

export interface SessionFormValidationInput {
	form: SessionFormValues
	accessTokenProp?: string
	apiBaseUrlProp?: string
	publicStoreIdProp?: string
	locale?: string
}

export type SessionFormErrors = Partial<Record<keyof SessionFormValues, string>>

export function validateSessionForm(input: SessionFormValidationInput): SessionFormErrors {
	const { form } = input
	const messages = getPbsMessages(input.locale ?? form.locale)
	const errors: SessionFormErrors = {}

	const accessToken = resolveHybridValue(form.accessToken, input.accessTokenProp)
	if (accessToken.length === 0) {
		errors.accessToken = messages.accessTokenRequired
	}

	const apiBaseUrl = resolveHybridValue(form.apiBaseUrl, input.apiBaseUrlProp)
	if (apiBaseUrl.length === 0) {
		errors.apiBaseUrl = messages.apiBaseUrlRequired
	}

	const publicStoreId = resolveHybridValue(form.publicStoreId, input.publicStoreIdProp)
	if (publicStoreId.length === 0) {
		errors.publicStoreId = messages.publicStoreIdRequired
	}

	if (majorAmountToCents(form.amount) === null) {
		errors.amount = messages.amountInvalid
	}

	if (form.currency.trim().length === 0) {
		errors.currency = messages.currencyRequired
	}

	if (form.reference.trim().length === 0) {
		errors.reference = messages.referenceRequired
	}

	if (form.returnUrl.trim().length === 0) {
		errors.returnUrl = messages.returnUrlRequired
	}

	if (form.captureMode === 'DELAYED') {
		const delay = Number.parseInt(form.captureDelayHours, 10)
		if (!Number.isFinite(delay) || delay <= 0) {
			errors.captureDelayHours = messages.delayHoursRequired
		}
	}

	if (form.tokenizationEnabled) {
		if (form.shopperReference.trim().length === 0) {
			errors.shopperReference = messages.shopperReferenceRequired
		}
	}

	return errors
}

export function hasSessionFormErrors(errors: SessionFormErrors): boolean {
	return Object.keys(errors).length > 0
}
