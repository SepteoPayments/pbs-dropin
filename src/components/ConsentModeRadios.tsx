import type { ConsentMode } from '../types'

interface ConsentModeRadiosProps {
	value: ConsentMode
	label: string
	askLabel: string
	forcedLabel: string
	disabled?: boolean
	onChange: (mode: ConsentMode) => void
}

const OPTIONS: { value: ConsentMode; labelKey: 'askLabel' | 'forcedLabel' }[] = [
	{ value: 'ASK_FOR_CONSENT', labelKey: 'askLabel' },
	{ value: 'FORCED', labelKey: 'forcedLabel' },
]

export function ConsentModeRadios({
	value,
	label,
	askLabel,
	forcedLabel,
	disabled,
	onChange,
}: ConsentModeRadiosProps) {
	const labels = {
		askLabel,
		forcedLabel,
	}

	return (
		<div className='pbs-dropin__field pbs-dropin__field--full'>
			<span className='pbs-dropin__label' id='pbs-consent-mode-label'>
				{label}
			</span>
			<div
				className='pbs-dropin__radios pbs-dropin__radios--two'
				role='radiogroup'
				aria-labelledby='pbs-consent-mode-label'
				data-testid='pbs-consent-mode'
			>
				{OPTIONS.map(option => (
					<label
						key={option.value}
						className={
							value === option.value ? 'pbs-dropin__radio pbs-dropin__radio--selected' : 'pbs-dropin__radio'
						}
					>
						<input
							type='radio'
							name='pbs-consent-mode'
							value={option.value}
							checked={value === option.value}
							disabled={disabled}
							onChange={() => onChange(option.value)}
						/>
						{labels[option.labelKey]}
					</label>
				))}
			</div>
		</div>
	)
}
