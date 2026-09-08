import { usePbsDropinFlow } from '../hooks/usePbsDropinFlow'
import { getPbsMessages } from '../i18n/messages'
import type { PbsDropinProps } from '../types'
import { isProvidedProp } from '../utils/hybridValue'
import { hasProvidedLineItems } from '../utils/lineItems'
import { AdyenDropinMount } from './AdyenDropinMount'
import { SessionForm } from './SessionForm'
import { StripeUnavailable } from './StripeUnavailable'

export function PbsDropin(props: PbsDropinProps) {
	const flow = usePbsDropinFlow(props)
	const messages = getPbsMessages(flow.locale)

	return (
		<div className='pbs-dropin' data-testid='pbs-dropin'>
			<SessionForm
				form={flow.form}
				errors={flow.errors}
				messages={messages}
				availableLocales={flow.availableLocales}
				showLanguageSelector={flow.showLanguageSelector}
				currencyOptions={flow.currencyOptions}
				apiBaseUrlPropProvided={isProvidedProp(props.apiBaseUrl)}
				adyenClientKeyPropProvided={isProvidedProp(props.adyenClientKey)}
				showIncludeLineItems={!hasProvidedLineItems(props.lineItems)}
				showConsentMode={props.consentMode === undefined}
				disabled={flow.status === 'submitting' || flow.session !== null}
				canSubmit={flow.canSubmit}
				isSubmitting={flow.status === 'submitting'}
				onFieldChange={flow.updateField}
				onSubmit={() => {
					void flow.submit()
				}}
				onResetSession={flow.session ? flow.resetSession : undefined}
			/>

			{flow.form.provider === 'stripe' && (
				<StripeUnavailable message={messages.stripeUnavailable} />
			)}

			{flow.submitError && (
				<div className='pbs-dropin__banner pbs-dropin__banner--error' role='alert'>
					{flow.submitError}
				</div>
			)}

			{flow.session && flow.form.provider === 'adyen' && (
				<AdyenDropinMount
					session={flow.session}
					clientKey={flow.resolvedAdyenClientKey}
					environment={flow.adyenEnvironment}
					locale={flow.locale}
					countryCode={flow.form.shopperCountryCode}
					translations={props.adyenTranslations}
					messages={messages}
					onPaymentCompleted={props.onPaymentCompleted}
					onError={props.onError}
				/>
			)}
		</div>
	)
}
