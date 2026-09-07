import { resolveCurrencyOptions, resolveInitialCurrency } from '../constants/currencies'
import { DEFAULT_API_BASE_URL, DEFAULT_RETURN_URL } from '../constants/defaults'
import { resolveAvailableLocales, resolveInitialLocale } from '../constants/locales'
import type { PbsDropinProps, SessionFormValues } from '../types'

export function createDefaultSessionForm(props: PbsDropinProps): SessionFormValues {
	const availableLocales = resolveAvailableLocales(props.locales)
	const currencyOptions = resolveCurrencyOptions(props.currencies)

	return {
		accessToken: props.accessToken ?? '',
		apiBaseUrl: props.apiBaseUrl ?? DEFAULT_API_BASE_URL,
		adyenClientKey: props.adyenClientKey ?? '',
		provider: 'adyen',
		publicStoreId: props.publicStoreId ?? '',
		amount: '10',
		currency: resolveInitialCurrency(undefined, currencyOptions),
		reference: 'test-session-001',
		returnUrl: DEFAULT_RETURN_URL,
		shopperCountryCode: '',
		locale: resolveInitialLocale(props.locale, availableLocales),
		captureMode: 'MANUAL',
		captureDelayHours: '',
		preAuth: false,
		moto: false,
		tokenizationEnabled: false,
		shopperReference: '',
		recurringModel: 'CARD_ON_FILE',
	}
}
