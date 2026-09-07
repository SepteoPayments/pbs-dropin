import { useCallback, useMemo, useState } from 'react'
import { createSession } from '../api/createSession'
import { isPbsApiError } from '../api/errors'
import { resolveCurrencyOptions } from '../constants/currencies'
import { DEFAULT_ADYEN_ENVIRONMENT, DEFAULT_API_BASE_URL } from '../constants/defaults'
import { resolveAvailableLocales } from '../constants/locales'
import { formToSessionRequest } from '../mappers/formToSessionRequest'
import type { AdyenEnvironment, CreateSessionResponse, PbsDropinProps, SessionFormValues } from '../types'
import { createDefaultSessionForm } from '../utils/defaultForm'
import { debugLog } from '../utils/debugLog'
import { resolveHybridValue } from '../utils/hybridValue'
import { getPbsMessages } from '../i18n/messages'
import { hasSessionFormErrors, validateSessionForm, type SessionFormErrors } from '../validation/validateSessionForm'

export type DropinFlowStatus = 'idle' | 'submitting' | 'ready' | 'error'

export interface UsePbsDropinFlowResult {
	form: SessionFormValues
	errors: SessionFormErrors
	status: DropinFlowStatus
	submitError: string | null
	session: CreateSessionResponse | null
	resolvedAccessToken: string
	resolvedApiBaseUrl: string
	resolvedAdyenClientKey: string
	resolvedPublicStoreId: string
	adyenEnvironment: AdyenEnvironment
	locale: string
	availableLocales: string[]
	showLanguageSelector: boolean
	currencyOptions: string[]
	canSubmit: boolean
	updateField: <K extends keyof SessionFormValues>(key: K, value: SessionFormValues[K]) => void
	submit: () => Promise<void>
	resetSession: () => void
}

export function usePbsDropinFlow(props: PbsDropinProps): UsePbsDropinFlowResult {
	const [form, setForm] = useState<SessionFormValues>(() => createDefaultSessionForm(props))
	const [errors, setErrors] = useState<SessionFormErrors>({})
	const [status, setStatus] = useState<DropinFlowStatus>('idle')
	const [submitError, setSubmitError] = useState<string | null>(null)
	const [session, setSession] = useState<CreateSessionResponse | null>(null)

	const resolvedAccessToken = resolveHybridValue(form.accessToken, props.accessToken)
	const resolvedApiBaseUrl =
		resolveHybridValue(form.apiBaseUrl, props.apiBaseUrl) || DEFAULT_API_BASE_URL
	const resolvedAdyenClientKey = resolveHybridValue(form.adyenClientKey, props.adyenClientKey)
	const resolvedPublicStoreId = resolveHybridValue(form.publicStoreId, props.publicStoreId)
	const adyenEnvironment = props.adyenEnvironment ?? DEFAULT_ADYEN_ENVIRONMENT
	const availableLocales = resolveAvailableLocales(props.locales)
	const showLanguageSelector = availableLocales.length > 1
	const locale = form.locale
	const currencyOptions = resolveCurrencyOptions(props.currencies)

	const canSubmit = form.provider === 'adyen' && status !== 'submitting' && session === null

	const updateField = useCallback(<K extends keyof SessionFormValues>(key: K, value: SessionFormValues[K]) => {
		setForm(previous => ({ ...previous, [key]: value }))
	}, [])

	const resetSession = useCallback(() => {
		setSession(null)
		setSubmitError(null)
		setStatus('idle')
	}, [])

	const submit = useCallback(async () => {
		if (form.provider !== 'adyen') {
			setSubmitError(getPbsMessages(locale).stripeUnavailable)
			setStatus('error')
			return
		}

		const nextErrors = validateSessionForm({
			form,
			accessTokenProp: props.accessToken,
			apiBaseUrlProp: props.apiBaseUrl,
			publicStoreIdProp: props.publicStoreId,
			locale,
		})
		setErrors(nextErrors)
		if (hasSessionFormErrors(nextErrors)) {
			setStatus('error')
			setSubmitError(getPbsMessages(locale).fixFormErrors)
			return
		}

		setStatus('submitting')
		setSubmitError(null)

		try {
			const body = formToSessionRequest({
				...form,
				publicStoreId: resolvedPublicStoreId,
			})
			debugLog('Creating public session', { apiBaseUrl: resolvedApiBaseUrl, reference: body.reference })
			const created = await createSession({
				apiBaseUrl: resolvedApiBaseUrl,
				accessToken: resolvedAccessToken,
				body,
			})
			setSession(created)
			setStatus('ready')
			props.onSessionCreated?.(created)
		} catch (error: unknown) {
			const message = isPbsApiError(error)
				? `${error.status}: ${error.message}`
				: error instanceof Error
					? error.message
					: getPbsMessages(locale).sessionCreationFailed
			debugLog('Session creation failed', { message })
			setSubmitError(message)
			setStatus('error')
			props.onError?.(error instanceof Error ? error : new Error(message))
		}
	}, [form, props, resolvedAccessToken, resolvedApiBaseUrl, resolvedPublicStoreId, locale])

	return useMemo(
		() => ({
			form,
			errors,
			status,
			submitError,
			session,
			resolvedAccessToken,
			resolvedApiBaseUrl,
			resolvedAdyenClientKey,
			resolvedPublicStoreId,
			adyenEnvironment,
			locale,
			availableLocales,
			showLanguageSelector,
			currencyOptions,
			canSubmit,
			updateField,
			submit,
			resetSession,
		}),
		[
			form,
			errors,
			status,
			submitError,
			session,
			resolvedAccessToken,
			resolvedApiBaseUrl,
			resolvedAdyenClientKey,
			resolvedPublicStoreId,
			adyenEnvironment,
			locale,
			availableLocales,
			showLanguageSelector,
			currencyOptions,
			canSubmit,
			updateField,
			submit,
			resetSession,
		]
	)
}
