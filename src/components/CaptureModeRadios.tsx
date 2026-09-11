import type { CaptureMode } from '../types'

interface CaptureModeRadiosProps {
	value: CaptureMode
	label: string
	immediateLabel: string
	delayedLabel: string
	manualLabel: string
	hint?: string
	helpLabel?: string
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
	helpLabel,
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
			<div className='pbs-dropin__label-row'>
				<span className='pbs-dropin__label' id='pbs-capture-mode-label'>
					{label}
				</span>
				{hint && (
					<button
						type='button'
						className='pbs-dropin__help'
						aria-label={helpLabel ?? hint}
						aria-describedby='pbs-capture-mode-help-text'
						data-testid='pbs-capture-mode-help'
					>
						<svg
							className='pbs-dropin__help-icon'
							viewBox='0 0 24 24'
							aria-hidden='true'
							focusable='false'
						>
							<path
								fill='currentColor'
								d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z'
							/>
						</svg>
						<span id='pbs-capture-mode-help-text' className='pbs-dropin__help-tooltip' role='tooltip'>
							{hint}
						</span>
					</button>
				)}
			</div>
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
		</div>
	)
}
