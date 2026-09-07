import type { ChangeEvent } from 'react'
import type { RecurringModel, SessionFormValues } from '../types'
import type { PbsMessages } from '../i18n/messages'
import type { SessionFormErrors } from '../validation/validateSessionForm'
import { AccessTokenField } from './AccessTokenField'
import { CaptureModeRadios } from './CaptureModeRadios'
import { CountrySelect } from './CountrySelect'
import { CurrencySelect } from './CurrencySelect'
import { LanguageSelector } from './LanguageSelector'
import { ProviderSelect } from './ProviderSelect'

interface SessionFormProps {
	form: SessionFormValues
	errors: SessionFormErrors
	messages: PbsMessages
	availableLocales: string[]
	showLanguageSelector: boolean
	currencyOptions: string[]
	accessTokenPropProvided: boolean
	apiBaseUrlPropProvided: boolean
	adyenClientKeyPropProvided: boolean
	publicStoreIdPropProvided: boolean
	disabled: boolean
	canSubmit: boolean
	isSubmitting: boolean
	onFieldChange: <K extends keyof SessionFormValues>(key: K, value: SessionFormValues[K]) => void
	onSubmit: () => void
	onResetSession?: () => void
}

function FieldError({ message }: { message?: string }) {
	if (!message) return null
	return <span className='pbs-dropin__error'>{message}</span>
}

export function SessionForm({
	form,
	errors,
	messages,
	availableLocales,
	showLanguageSelector,
	currencyOptions,
	accessTokenPropProvided,
	apiBaseUrlPropProvided,
	adyenClientKeyPropProvided,
	publicStoreIdPropProvided,
	disabled,
	canSubmit,
	isSubmitting,
	onFieldChange,
	onSubmit,
	onResetSession,
}: SessionFormProps) {
	const handleText =
		(key: keyof SessionFormValues) =>
		(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			onFieldChange(key, event.target.value as SessionFormValues[typeof key])
		}

	const handleCheckbox =
		(key: 'preAuth' | 'moto' | 'tokenizationEnabled') => (event: ChangeEvent<HTMLInputElement>) => {
			onFieldChange(key, event.target.checked)
		}

	return (
		<form
			className='pbs-dropin__section'
			onSubmit={event => {
				event.preventDefault()
				onSubmit()
			}}
		>
			<div className='pbs-dropin__section-header'>
				<h2 className='pbs-dropin__title'>{messages.sessionTitle}</h2>
				{showLanguageSelector && (
					<LanguageSelector
						locale={form.locale}
						locales={availableLocales}
						label={messages.locale}
						disabled={disabled}
						onChange={nextLocale => onFieldChange('locale', nextLocale)}
					/>
				)}
			</div>

			<div className='pbs-dropin__grid'>
				{!accessTokenPropProvided && (
					<AccessTokenField
						value={form.accessToken}
						onChange={value => onFieldChange('accessToken', value)}
						label={messages.accessToken}
						error={errors.accessToken}
					/>
				)}

				{!publicStoreIdPropProvided && (
					<div className='pbs-dropin__field pbs-dropin__field--full'>
						<label className='pbs-dropin__label' htmlFor='pbs-public-store-id'>
							{messages.publicStoreId}
						</label>
						<input
							id='pbs-public-store-id'
							className='pbs-dropin__input'
							value={form.publicStoreId}
							onChange={handleText('publicStoreId')}
							disabled={disabled}
						/>
						<FieldError message={errors.publicStoreId} />
					</div>
				)}

				<div className='pbs-dropin__field pbs-dropin__field--full'>
					<label className='pbs-dropin__label' htmlFor='pbs-return-url'>
						{messages.returnUrl}
					</label>
					<input
						id='pbs-return-url'
						className='pbs-dropin__input'
						value={form.returnUrl}
						onChange={handleText('returnUrl')}
						disabled={disabled}
					/>
					<FieldError message={errors.returnUrl} />
				</div>

				<CaptureModeRadios
					value={form.captureMode}
					label={messages.captureMode}
					immediateLabel={messages.captureImmediate}
					delayedLabel={messages.captureDelayed}
					manualLabel={messages.captureManual}
					disabled={disabled}
					onChange={mode => onFieldChange('captureMode', mode)}
				/>

				{form.captureMode === 'DELAYED' && (
					<div
						className='pbs-dropin__field pbs-dropin__field--full'
						data-testid='pbs-delay-hours-field'
					>
						<label className='pbs-dropin__label' htmlFor='pbs-delay-hours'>
							{messages.delayHours}
						</label>
						<input
							id='pbs-delay-hours'
							className='pbs-dropin__input'
							value={form.captureDelayHours}
							onChange={handleText('captureDelayHours')}
							inputMode='numeric'
							disabled={disabled}
						/>
						<FieldError message={errors.captureDelayHours} />
					</div>
				)}

				<div className='pbs-dropin__row' data-testid='pbs-provider-reference-row'>
					<ProviderSelect
						value={form.provider}
						onChange={value => onFieldChange('provider', value)}
						label={messages.provider}
						disabled={disabled}
					/>

					<div className='pbs-dropin__field'>
						<label className='pbs-dropin__label' htmlFor='pbs-reference'>
							{messages.reference}
						</label>
						<input
							id='pbs-reference'
							className='pbs-dropin__input'
							value={form.reference}
							onChange={handleText('reference')}
							disabled={disabled}
						/>
						<FieldError message={errors.reference} />
					</div>
				</div>

				<div className='pbs-dropin__checkboxes' data-testid='pbs-checkboxes'>
					<label className='pbs-dropin__checkbox'>
						<input
							type='checkbox'
							checked={form.preAuth}
							onChange={handleCheckbox('preAuth')}
							disabled={disabled}
						/>
						{messages.preAuth}
					</label>
					<label className='pbs-dropin__checkbox'>
						<input
							type='checkbox'
							checked={form.moto}
							onChange={handleCheckbox('moto')}
							disabled={disabled}
						/>
						{messages.moto}
					</label>
					<label className='pbs-dropin__checkbox'>
						<input
							type='checkbox'
							checked={form.tokenizationEnabled}
							onChange={handleCheckbox('tokenizationEnabled')}
							disabled={disabled}
						/>
						{messages.tokenization}
					</label>
				</div>

				{form.tokenizationEnabled && (
					<div className='pbs-dropin__tokenization'>
						<div className='pbs-dropin__field'>
							<label className='pbs-dropin__label' htmlFor='pbs-shopper-ref'>
								{messages.shopperReference}
							</label>
							<input
								id='pbs-shopper-ref'
								className='pbs-dropin__input'
								value={form.shopperReference}
								onChange={handleText('shopperReference')}
								disabled={disabled}
							/>
							<FieldError message={errors.shopperReference} />
						</div>
						<div className='pbs-dropin__field'>
							<label className='pbs-dropin__label' htmlFor='pbs-recurring-model'>
								{messages.recurringModel}
							</label>
							<select
								id='pbs-recurring-model'
								className='pbs-dropin__select'
								value={form.recurringModel}
								onChange={event =>
									onFieldChange('recurringModel', event.target.value as RecurringModel)
								}
								disabled={disabled}
							>
								<option value='SUBSCRIPTION'>{messages.recurringSubscription}</option>
								<option value='CARD_ON_FILE'>{messages.recurringCardOnFile}</option>
								<option value='UNSCHEDULED'>{messages.recurringUnscheduled}</option>
							</select>
						</div>
					</div>
				)}

				<div className='pbs-dropin__row' data-testid='pbs-amount-currency-row'>
					<div className='pbs-dropin__field'>
						<label className='pbs-dropin__label' htmlFor='pbs-amount'>
							{messages.amount}
						</label>
						<input
							id='pbs-amount'
							className='pbs-dropin__input'
							value={form.amount}
							onChange={handleText('amount')}
							inputMode='decimal'
							disabled={disabled}
						/>
						<FieldError message={errors.amount} />
					</div>

					<CurrencySelect
						value={form.currency}
						options={currencyOptions}
						locale={form.locale}
						label={messages.currency}
						disabled={disabled}
						onChange={currency => onFieldChange('currency', currency)}
					/>
				</div>

				<CountrySelect
					value={form.shopperCountryCode}
					locale={form.locale}
					label={messages.shopperCountry}
					placeholder={messages.countrySearchPlaceholder}
					disabled={disabled}
					onChange={countryCode => onFieldChange('shopperCountryCode', countryCode)}
				/>

				{!apiBaseUrlPropProvided && (
					<div className='pbs-dropin__field pbs-dropin__field--full'>
						<label className='pbs-dropin__label' htmlFor='pbs-api-base-url'>
							{messages.apiBaseUrl}
						</label>
						<input
							id='pbs-api-base-url'
							className='pbs-dropin__input'
							value={form.apiBaseUrl}
							onChange={handleText('apiBaseUrl')}
							disabled={disabled}
						/>
						<FieldError message={errors.apiBaseUrl} />
					</div>
				)}

				{!adyenClientKeyPropProvided && (
					<div className='pbs-dropin__field pbs-dropin__field--full'>
						<label className='pbs-dropin__label' htmlFor='pbs-adyen-client-key'>
							{messages.adyenClientKey}
						</label>
						<input
							id='pbs-adyen-client-key'
							className='pbs-dropin__input'
							value={form.adyenClientKey}
							onChange={handleText('adyenClientKey')}
							disabled={disabled}
						/>
					</div>
				)}
			</div>

			<div className='pbs-dropin__actions'>
				<button
					type='submit'
					className='pbs-dropin__button'
					data-testid='pbs-submit-session'
					disabled={!canSubmit || disabled}
				>
					{isSubmitting ? messages.creatingSession : messages.createSession}
				</button>
				{onResetSession && (
					<button
						type='button'
						className='pbs-dropin__button pbs-dropin__button--secondary'
						data-testid='pbs-reset-session'
						onClick={onResetSession}
					>
						{messages.newSession}
					</button>
				)}
			</div>
		</form>
	)
}
