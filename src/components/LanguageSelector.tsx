import { useEffect, useRef, useState } from 'react'
import { countryCodeFromLocale, localeOptionLabel } from '../constants/locales'
import { CountryFlag } from './CountryFlag'

interface LanguageSelectorProps {
	locale: string
	locales: string[]
	disabled?: boolean
	label: string
	onChange: (locale: string) => void
}

export function LanguageSelector({ locale, locales, disabled, label, onChange }: LanguageSelectorProps) {
	const [isOpen, setIsOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)

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
		<div className='pbs-dropin__language' ref={rootRef}>
			<button
				type='button'
				className='pbs-dropin__language-trigger'
				data-testid='pbs-locale'
				aria-label={label}
				aria-haspopup='listbox'
				aria-expanded={isOpen}
				disabled={disabled}
				onClick={() => setIsOpen(open => !open)}
			>
				<CountryFlag countryCode={countryCodeFromLocale(locale)} size={16} />
			</button>
			{isOpen && (
				<ul className='pbs-dropin__language-menu' role='listbox' aria-label={label}>
					{locales.map(option => (
						<li key={option} role='presentation'>
							<button
								type='button'
								className={
									option === locale
										? 'pbs-dropin__language-option pbs-dropin__language-option--selected'
										: 'pbs-dropin__language-option'
								}
								role='option'
								aria-selected={option === locale}
								onClick={() => {
									onChange(option)
									setIsOpen(false)
								}}
							>
								<CountryFlag countryCode={countryCodeFromLocale(option)} size={16} />
								<span>{localeOptionLabel(option)}</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
