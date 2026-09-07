import type { CreateSessionResponse } from './session'
import type { AdyenEnvironment } from './enums'

export interface PbsDropinCallbacks {
	onSessionCreated?: (session: CreateSessionResponse) => void
	onPaymentCompleted?: (result: { resultCode: string }) => void
	onError?: (error: Error) => void
}

export interface PbsDropinProps extends PbsDropinCallbacks {
	/** If provided, the access-token field is hidden and this value is used. */
	accessToken?: string
	/** If provided, the API base URL field is hidden and this value is used. */
	apiBaseUrl?: string
	/** If provided, the Adyen client-key field is hidden and this value is used. */
	adyenClientKey?: string
	adyenEnvironment?: AdyenEnvironment
	/** If provided, the store-id field is hidden and this value is used. */
	publicStoreId?: string
	/**
	 * Languages offered in the compact selector (BCP 47, e.g. fr-FR).
	 * One language hides the selector and freezes the drop-in.
	 */
	locales?: string[]
	/**
	 * Language at launch (form + Adyen `locale`). Defaults to fr-FR when present in `locales`.
	 */
	locale?: string
	/**
	 * Currencies offered in the select. Empty / omitted → EUR only.
	 */
	currencies?: string[]
	/** Optional Adyen Web `translations` overrides for the Drop-in UI. */
	adyenTranslations?: {
		[locale: string]: {
			[translationKey: string]: string
		}
	}
}
