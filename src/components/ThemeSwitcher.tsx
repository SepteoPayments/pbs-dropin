import { PBS_THEME_NAMES, PBS_THEMES, type ThemeName } from '../themes/pbsThemes'

interface ThemeSwitcherProps {
	theme: ThemeName
	label: string
	onChange: (theme: ThemeName) => void
}

export function ThemeSwitcher({ theme, label, onChange }: ThemeSwitcherProps) {
	return (
		<div className='pbs-dropin__themes' role='group' aria-label={label} data-testid='pbs-themes'>
			{PBS_THEME_NAMES.map(name => (
				<button
					key={name}
					type='button'
					className={
						theme === name
							? 'pbs-dropin__theme-btn pbs-dropin__theme-btn--active'
							: 'pbs-dropin__theme-btn'
					}
					onClick={() => onChange(name)}
					aria-pressed={theme === name}
					data-testid={`pbs-theme-${name}`}
				>
					<span
						className='pbs-dropin__theme-dot'
						style={{ background: PBS_THEMES[name].swatch }}
					/>
					{PBS_THEMES[name].label}
				</button>
			))}
		</div>
	)
}
