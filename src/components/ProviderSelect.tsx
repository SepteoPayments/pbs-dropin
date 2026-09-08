import type { ChangeEvent } from 'react'
import type { PaymentProvider } from '../types'
import { FieldLabel } from './FieldLabel'

interface ProviderSelectProps {
	value: PaymentProvider
	onChange: (provider: PaymentProvider) => void
	label: string
	disabled?: boolean
	required?: boolean
	error?: string
}

export function ProviderSelect({
	value,
	onChange,
	label,
	disabled,
	required,
	error,
}: ProviderSelectProps) {
	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value as PaymentProvider)
	}

	return (
		<div className='pbs-dropin__field'>
			<FieldLabel htmlFor='pbs-provider' required={required}>
				{label}
			</FieldLabel>
			<select
				id='pbs-provider'
				className='pbs-dropin__select'
				value={value}
				onChange={handleChange}
				disabled={disabled}
				aria-required={required}
			>
				<option value='adyen'>Adyen</option>
				<option value='stripe'>Stripe</option>
			</select>
			{error && <span className='pbs-dropin__error'>{error}</span>}
		</div>
	)
}
