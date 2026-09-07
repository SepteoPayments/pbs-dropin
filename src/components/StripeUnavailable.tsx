interface StripeUnavailableProps {
	message: string
}

export function StripeUnavailable({ message }: StripeUnavailableProps) {
	return (
		<div className='pbs-dropin__banner pbs-dropin__banner--info' role='status'>
			{message}
		</div>
	)
}
