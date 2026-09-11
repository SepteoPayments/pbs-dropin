interface SessionFlagsCheckboxesProps {
	preAuth: boolean
	moto: boolean
	tokenizationEnabled: boolean
	optionsLabel: string
	preAuthLabel: string
	motoLabel: string
	tokenizationLabel: string
	disabled?: boolean
	onChange: (key: 'preAuth' | 'moto' | 'tokenizationEnabled', value: boolean) => void
}

type SessionFlagKey = 'preAuth' | 'moto' | 'tokenizationEnabled'

type SessionFlagLabelKey = 'preAuthLabel' | 'motoLabel' | 'tokenizationLabel'

const FLAGS: { key: SessionFlagKey; labelKey: SessionFlagLabelKey }[] = [
	{ key: 'preAuth', labelKey: 'preAuthLabel' },
	{ key: 'moto', labelKey: 'motoLabel' },
	{ key: 'tokenizationEnabled', labelKey: 'tokenizationLabel' },
]

export function SessionFlagsCheckboxes({
	preAuth,
	moto,
	tokenizationEnabled,
	optionsLabel,
	preAuthLabel,
	motoLabel,
	tokenizationLabel,
	disabled,
	onChange,
}: SessionFlagsCheckboxesProps) {
	const values = {
		preAuth,
		moto,
		tokenizationEnabled,
	}
	const labels = {
		preAuthLabel,
		motoLabel,
		tokenizationLabel,
	}

	return (
		<div className='pbs-dropin__field pbs-dropin__field--full'>
			<span className='pbs-dropin__label' id='pbs-session-options-label'>
				{optionsLabel}
			</span>
			<div
				className='pbs-dropin__checkboxes'
				role='group'
				aria-labelledby='pbs-session-options-label'
				data-testid='pbs-checkboxes'
			>
				{FLAGS.map(flag => (
					<label
						key={flag.key}
						className={
							values[flag.key]
								? 'pbs-dropin__checkbox pbs-dropin__checkbox--selected'
								: 'pbs-dropin__checkbox'
						}
					>
						<input
							type='checkbox'
							checked={values[flag.key]}
							disabled={disabled}
							onChange={event => onChange(flag.key, event.target.checked)}
						/>
						{labels[flag.labelKey]}
					</label>
				))}
			</div>
		</div>
	)
}
