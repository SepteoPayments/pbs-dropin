import type { CaptureMode } from '../types'

interface CaptureModeRadiosProps {
	value: CaptureMode
	label: string
	immediateLabel: string
	delayedLabel: string
	manualLabel: string
	hint?: string
	disabled?: boolean
	onChange: (mode: CaptureMode) => void
}

const OPTIONS: { value: CaptureMode; labelKey: 'immediateLabel' | 'delayedLabel' | 'manualLabel' }[] = [
	{ value: 'IMMEDIATE', labelKey: 'immediateLabel' },
	{ value: 'DELAYED', labelKey: 'delayedLabel' },
	{ value: 'MANUAL', labelKey: 'manualLabel' },
]

export function CaptureModeRadios({
	value,
	label,
	immediateLabel,
	delayedLabel,
	manualLabel,
	hint,
	disabled,
	onChange,
}: CaptureModeRadiosProps) {
	const labels = {
		immediateLabel,
		delayedLabel,
		manualLabel,
	}

	return (
		<div className='pbs-dropin__field pbs-dropin__field--full'>
			<span className='pbs-dropin__label' id='pbs-capture-mode-label'>
				{label}
			</span>
			<div
				className='pbs-dropin__radios'
				role='radiogroup'
				aria-labelledby='pbs-capture-mode-label'
				data-testid='pbs-capture-mode'
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
							name='pbs-capture-mode'
							value={option.value}
							checked={value === option.value}
							disabled={disabled}
							onChange={() => onChange(option.value)}
						/>
						{labels[option.labelKey]}
					</label>
				))}
			</div>
			{hint && <p className='pbs-dropin__hint'>{hint}</p>}
		</div>
	)
}
