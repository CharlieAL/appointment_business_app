import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Card } from '@/components/card'

describe('card', () => {
	afterEach(cleanup)

	it('should render the card correctly', () => {
		render(
			<Card
				title={'5'}
				description="Total"
				info={'10:00 AM'}
				status={'completed'}
			/>
		)
		expect(screen.getByText('Total'))
		expect(screen.getByText('5'))
		expect(screen.getByText('10:00 AM'))
	})
})
