import { useEffect, useRef, useState } from 'react'
import { getCountryCodeForCurrency, getCurrencyLabel } from '../constants/currencies'
import { CountryFlag } from './CountryFlag'

interface CurrencySelectProps {
	value: string
	options: string[]
	locale: string
	label: string
	disabled?: boolean
	onChange: (currency: string) => void
}

export function CurrencySelect({
	value,
	options,
	locale,
	label,
	disabled,
	onChange,
}: CurrencySelectProps) {
	const [isOpen, setIsOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)
	const selectedLabel = getCurrencyLabel(value, locale)
	const selectedFlag = getCountryCodeForCurrency(value)

	useEffect(() => {
		if (!isOpen) {
			return
		}
		const handlePointerDown = (event: PointerEvent) => {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('pointerdown', handlePointerDown)
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown)
		}
	}, [isOpen])

	return (
		<div className='pbs-dropin__field'>
			<span className='pbs-dropin__label' id='pbs-currency-label'>
				{label}
			</span>
			<div className='pbs-dropin__currency-select' ref={rootRef}>
				<button
					type='button'
					className='pbs-dropin__currency-trigger'
					data-testid='pbs-currency'
					aria-labelledby='pbs-currency-label'
					aria-haspopup='listbox'
					aria-expanded={isOpen}
					disabled={disabled}
					onClick={() => {
						if (!disabled) {
							setIsOpen(open => !open)
						}
					}}
				>
					{selectedFlag && (
						<span className='pbs-dropin__currency-flag'>
							<CountryFlag countryCode={selectedFlag} size={16} />
						</span>
					)}
					<span>{selectedLabel || value}</span>
				</button>
				{isOpen && (
					<div className='pbs-dropin__menu' role='listbox' aria-labelledby='pbs-currency-label'>
						{options.map(option => {
							const flag = getCountryCodeForCurrency(option)
							return (
								<button
									key={option}
									type='button'
									className={
										option === value
											? 'pbs-dropin__menu-option pbs-dropin__menu-option--selected'
											: 'pbs-dropin__menu-option'
									}
									role='option'
									aria-selected={option === value}
									onClick={() => {
										onChange(option)
										setIsOpen(false)
									}}
								>
									{flag && <CountryFlag countryCode={flag} size={16} />}
									<span>{getCurrencyLabel(option, locale)}</span>
								</button>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
