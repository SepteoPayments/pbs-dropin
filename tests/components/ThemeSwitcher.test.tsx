import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ThemeSwitcher } from '../../src/components/ThemeSwitcher'

describe('ThemeSwitcher', () => {
	it('marks the current theme as pressed', () => {
		const onChange = vi.fn()
		render(<ThemeSwitcher theme='bleu' label='Thème de couleur' onChange={onChange} />)
		expect(screen.getByTestId('pbs-theme-bleu')).toHaveAttribute('aria-pressed', 'true')
		expect(screen.getByRole('group', { name: 'Thème de couleur' })).toBeInTheDocument()
	})

	it('notifies when another theme is selected', async () => {
		const user = userEvent.setup()
		const onChange = vi.fn()
		render(<ThemeSwitcher theme='blanc' label='Thème de couleur' onChange={onChange} />)
		await user.click(screen.getByTestId('pbs-theme-azur'))
		expect(onChange).toHaveBeenCalledWith('azur')
	})
})
