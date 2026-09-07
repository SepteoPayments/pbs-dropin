import { DynamicFlag } from '@sankyu/react-circle-flags'

type CountryFlagProps = {
	readonly countryCode: string
	readonly size?: number
	readonly className?: string
}

export function CountryFlag({ countryCode, size = 16, className = '' }: CountryFlagProps) {
	const normalized = countryCode.trim().toUpperCase()
	if (normalized.length === 0) {
		return null
	}

	const code = normalized === 'EU' ? 'eu' : normalized.toLowerCase()

	return <DynamicFlag code={code} width={size} height={size} className={className} aria-hidden='true' />
}
