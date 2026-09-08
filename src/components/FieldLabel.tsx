interface FieldLabelProps {
	htmlFor?: string
	id?: string
	required?: boolean
	children: string
}

export function FieldLabel({ htmlFor, id, required, children }: FieldLabelProps) {
	const className = required ? 'pbs-dropin__label pbs-dropin__label--required' : 'pbs-dropin__label'

	if (htmlFor) {
		return (
			<label className={className} htmlFor={htmlFor}>
				{children}
			</label>
		)
	}

	return (
		<span className={className} id={id}>
			{children}
		</span>
	)
}
