import { getPbsMessages } from '../i18n/messages'
import type { CreateSessionLineItem, SessionFormValues } from '../types'
import { majorAmountToCents } from '../utils/amount'
import { resolveHybridValue } from '../utils/hybridValue'

const RECURRING_MODELS: ReadonlySet<string> = new Set([
	'SUBSCRIPTION',
	'CARD_ON_FILE',
	'UNSCHEDULED',
])

const PROVIDERS: ReadonlySet<string> = new Set(['adyen', 'stripe'])

export interface SessionFormValidationInput {
	form: SessionFormValues
	accessToken: string
	publicStoreId: string
	returnUrl: string
	apiBaseUrlProp?: string
	locale?: string
	lineItemsFromProps?: CreateSessionLineItem[]
}

export type SessionFormErrors = Partial<Record<keyof SessionFormValues, string>>

export function validateSessionForm(input: SessionFormValidationInput): SessionFormErrors {
	const { form } = input
	const messages = getPbsMessages(input.locale ?? form.locale)
	const errors: SessionFormErrors = {}

	if (input.accessToken.trim().length === 0) {
		errors.accessToken = messages.accessTokenRequired
	}

	const apiBaseUrl = resolveHybridValue(form.apiBaseUrl, input.apiBaseUrlProp)
	if (apiBaseUrl.length === 0) {
		errors.apiBaseUrl = messages.apiBaseUrlRequired
	}

	if (input.publicStoreId.trim().length === 0) {
		errors.publicStoreId = messages.publicStoreIdRequired
	}

	if (!PROVIDERS.has(form.provider)) {
		errors.provider = messages.providerRequired
	}

	if (form.amount.trim().length === 0) {
		errors.amount = messages.amountRequired
	} else if (majorAmountToCents(form.amount) === null) {
		errors.amount = messages.amountInvalid
	}

	if (form.currency.trim().length === 0) {
		errors.currency = messages.currencyRequired
	}

	if (form.reference.trim().length === 0) {
		errors.reference = messages.referenceRequired
	}

	if (input.returnUrl.trim().length === 0) {
		errors.returnUrl = messages.returnUrlRequired
	}

	if (form.shopperCountryCode.trim().length === 0) {
		errors.shopperCountryCode = messages.shopperCountryRequired
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
		if (!RECURRING_MODELS.has(form.recurringModel)) {
			errors.recurringModel = messages.recurringModelRequired
		}
	}

	return errors
}

export function hasSessionFormErrors(errors: SessionFormErrors): boolean {
	return Object.keys(errors).length > 0
}
