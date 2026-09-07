import type { ChangeEvent } from 'react'

interface AccessTokenFieldProps {
	value: string
	onChange: (value: string) => void
	label: string
	error?: string
}

export function AccessTokenField({ value, onChange, label, error }: AccessTokenFieldProps) {
	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		onChange(event.target.value)
	}

	return (
		<div className='pbs-dropin__field pbs-dropin__field--full'>
			<label className='pbs-dropin__label' htmlFor='pbs-access-token'>
				{label}
			</label>
			<textarea
				id='pbs-access-token'
				className='pbs-dropin__textarea'
				value={value}
				onChange={handleChange}
				autoComplete='off'
				spellCheck={false}
			/>
			{error && <span className='pbs-dropin__error'>{error}</span>}
		</div>
	)
}
