import type { ChangeEvent } from 'react'
import type { PaymentProvider } from '../types'

interface ProviderSelectProps {
	value: PaymentProvider
	onChange: (provider: PaymentProvider) => void
	label: string
	disabled?: boolean
}

export function ProviderSelect({ value, onChange, label, disabled }: ProviderSelectProps) {
	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value as PaymentProvider)
	}

	return (
		<div className='pbs-dropin__field'>
			<label className='pbs-dropin__label' htmlFor='pbs-provider'>
				{label}
			</label>
			<select
				id='pbs-provider'
				className='pbs-dropin__select'
				value={value}
				onChange={handleChange}
				disabled={disabled}
			>
				<option value='adyen'>Adyen</option>
				<option value='stripe'>Stripe</option>
			</select>
		</div>
	)
}
