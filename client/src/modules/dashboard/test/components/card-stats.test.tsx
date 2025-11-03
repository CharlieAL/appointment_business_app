import { cleanup, render, screen } from '@testing-library/react'
import { Calendar } from 'lucide-react'
import { afterEach, describe, expect, it } from 'vitest'
import { CardStats } from '../../components/card-stats'

describe('card-stats', () => {
	afterEach(cleanup)

	it('should render the value and label correctly', () => {
		render(<CardStats value={'5'} label="Total" Icon={Calendar} />)
		expect(screen.getByText('Total'))
		expect(screen.getByText('5'))
	})
})
