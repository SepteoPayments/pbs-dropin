import {
	AdyenCheckout,
	Dropin,
	type CoreConfiguration,
	type DropinConfiguration,
	type PaymentCompletedData,
	type PaymentFailedData,
} from '@adyen/adyen-web/auto'
import '@adyen/adyen-web/styles/adyen.css'
import { useEffect, useRef, useState } from 'react'
import type { PbsMessages } from '../i18n/messages'
import { mapClientSessionToAdyen } from '../mappers/mapClientSessionToAdyen'
import type { AdyenEnvironment, CreateSessionResponse } from '../types'
import { debugLog } from '../utils/debugLog'

const DROPIN_CONTAINER_ID = 'pbs-dropin-adyen'

interface AdyenDropinMountProps {
	session: CreateSessionResponse
	clientKey: string
	environment: AdyenEnvironment
	locale: string
	countryCode: string
	translations?: CoreConfiguration['translations']
	messages: PbsMessages
	onPaymentCompleted?: (result: { resultCode: string }) => void
	onError?: (error: Error) => void
}

export function AdyenDropinMount({
	session,
	clientKey,
	environment,
	locale,
	countryCode,
	translations,
	messages,
	onPaymentCompleted,
	onError,
}: AdyenDropinMountProps) {
	const dropinRef = useRef<Dropin | null>(null)
	const [mountError, setMountError] = useState<string | null>(null)
	const [paymentMessage, setPaymentMessage] = useState<string | null>(null)

	useEffect(() => {
		if (!clientKey) {
			setMountError(messages.adyenClientKeyRequired)
			return
		}

		let cancelled = false

		const mountDropin = async () => {
			try {
				const adyenSession = mapClientSessionToAdyen(session)
				debugLog('Mounting Adyen drop-in', {
					sessionId: adyenSession.id,
					sessionDataLength: adyenSession.sessionData.length,
					environment,
					locale,
				})
				const globalConfiguration: CoreConfiguration = {
					session: {
						id: adyenSession.id,
						sessionData: adyenSession.sessionData,
					},
					environment,
					locale,
					countryCode: countryCode || 'FR',
					clientKey,
					...(translations ? { translations } : {}),
					onPaymentCompleted: (result: PaymentCompletedData) => {
						setPaymentMessage(messages.paymentCompleted(result.resultCode))
						onPaymentCompleted?.({ resultCode: result.resultCode })
					},
					onPaymentFailed: (result: PaymentFailedData) => {
						const error = new Error(messages.paymentFailed(result.resultCode))
						setMountError(error.message)
						onError?.(error)
					},
					onError: (error: Error) => {
						debugLog('Adyen drop-in error', { message: error.message })
						setMountError(error.message)
						onError?.(error)
					},
				}

				const checkout = await AdyenCheckout(globalConfiguration)
				if (cancelled) {
					return
				}

				const dropinConfiguration: DropinConfiguration = {
					showPayButton: true,
					disableFinalAnimation: false,
					showStoredPaymentMethods: true,
					showPaymentMethods: true,
					paymentMethodsConfiguration: {
						card: {
							hasHolderName: true,
							holderNameRequired: true,
						},
						googlepay: {
							buttonType: 'pay',
							configuration: {
								gatewayMerchantId: 'Septeo',
								merchantId: 'BCR2DN7TSDNPH7DO',
							},
						},
					},
				}

				dropinRef.current?.unmount?.()
				dropinRef.current = new Dropin(checkout, dropinConfiguration).mount(`#${DROPIN_CONTAINER_ID}`)
				setMountError(null)
			} catch (error: unknown) {
				const message = error instanceof Error ? error.message : messages.adyenMountFailed
				debugLog('Adyen drop-in mount failed', { message })
				setMountError(message)
				onError?.(error instanceof Error ? error : new Error(message))
			}
		}

		void mountDropin()

		return () => {
			cancelled = true
			dropinRef.current?.unmount?.()
			dropinRef.current = null
		}
	}, [session, clientKey, environment, locale, countryCode, translations, messages, onPaymentCompleted, onError])

	return (
		<div className='pbs-dropin__section'>
			{mountError && <div className='pbs-dropin__banner pbs-dropin__banner--error'>{mountError}</div>}
			{paymentMessage && <div className='pbs-dropin__banner pbs-dropin__banner--success'>{paymentMessage}</div>}
			<div id={DROPIN_CONTAINER_ID} className='pbs-dropin__widget' data-testid='pbs-adyen-dropin' />
		</div>
	)
}
