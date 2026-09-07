import { useEffect, useMemo, useRef, useState } from 'react'
import {
	COUNTRY_SEARCH_MIN_CHARACTERS,
	filterCountries,
	getDisplayableCountries,
} from '../constants/countries'
import { CountryFlag } from './CountryFlag'

interface CountrySelectProps {
	value: string
	locale: string
	label: string
	placeholder: string
	disabled?: boolean
	onChange: (countryCode: string) => void
}

export function CountrySelect({
	value,
	locale,
	label,
	placeholder,
	disabled,
	onChange,
}: CountrySelectProps) {
	const countries = useMemo(() => getDisplayableCountries(locale), [locale])
	const selected = countries.find(country => country.id === value)
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!isOpen) {
			return
		}
		const handlePointerDown = (event: PointerEvent) => {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
				setIsOpen(false)
				setQuery('')
			}
		}
		document.addEventListener('pointerdown', handlePointerDown)
		return () => {
			document.removeEventListener('pointerdown', handlePointerDown)
		}
	}, [isOpen])

	const options = filterCountries(countries, query, COUNTRY_SEARCH_MIN_CHARACTERS)
	const showMenu = isOpen && options.length > 0

	return (
		<div className='pbs-dropin__field pbs-dropin__field--full' ref={rootRef}>
			<label className='pbs-dropin__label' htmlFor='pbs-country'>
				{label}
			</label>
			<div className='pbs-dropin__country-select'>
				{selected && !isOpen && (
					<span className='pbs-dropin__country-flag'>
						<CountryFlag countryCode={selected.id} size={18} />
					</span>
				)}
				<input
					id='pbs-country'
					className='pbs-dropin__input'
					data-testid='pbs-country'
					value={isOpen ? query : (selected?.label ?? value)}
					placeholder={placeholder}
					disabled={disabled}
					autoComplete='off'
					onFocus={() => {
						if (disabled) {
							return
						}
						setIsOpen(true)
						setQuery('')
					}}
					onChange={event => {
						setQuery(event.target.value)
						setIsOpen(true)
					}}
				/>
				{showMenu && (
					<div
						className='pbs-dropin__country-menu'
						role='listbox'
						aria-label={label}
						data-testid='pbs-country-menu'
					>
						{options.map(option => (
							<button
								key={option.id}
								type='button'
								className={
									option.id === value
										? 'pbs-dropin__country-option pbs-dropin__country-option--selected'
										: 'pbs-dropin__country-option'
								}
								role='option'
								aria-selected={option.id === value}
								onClick={() => {
									onChange(option.id)
									setIsOpen(false)
									setQuery('')
								}}
							>
								<CountryFlag countryCode={option.id} size={18} />
								<span>{option.label}</span>
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
