import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DashboardPage } from '../pages'

describe('DashboardPage', () => {
	afterEach(cleanup)
	it('should render the dashboard title', () => {
		render(<DashboardPage />)
		expect(screen.getByText('Dashboard'))
	})

	it('should render the welcome message', () => {
		render(<DashboardPage />)
		expect(screen.getByText('Bienvenido Nombre'))
	})

	it('should display the statistics for the day', () => {
		render(<DashboardPage />)
		expect(screen.getByRole('heading', { name: 'Información del día' }))

		// cards
		//  card total appointments
		expect(screen.getByText('Total'))
		expect(screen.getByText('5'))
		const icon = screen.getByTestId('icon-calendar')
		expect(icon)
		//  card completed appointments
		expect(screen.getByText('Completadas'))
		expect(screen.getByText('3'))
		const iconCompleted = screen.getByTestId('icon-circle-check')
		expect(iconCompleted)
		//  card pending appointments
		expect(screen.getByText('Pendientes'))
		expect(screen.getByText('2'))
		const iconPending = screen.getByTestId('icon-clock')
		expect(iconPending)
		//  card earnings
		expect(screen.getByText('Ganancias'))
		expect(screen.getByText('2,300'))
		const iconEarnings = screen.getByTestId('icon-dollar-sign')
		expect(iconEarnings)
	})

	it('should display the upcoming appointments section', () => {
		render(<DashboardPage />)
		expect(screen.getByRole('heading', { name: 'Próximas citas' }))
		const button = screen.getByRole('button', { name: 'Agendar' })
		expect(button)
	})

	it('should display the list of upcoming appointments', () => {
		render(<DashboardPage />)
		// appointment 1
		expect(screen.getByText('Charlie'))
		expect(screen.getByText('10:00 AM'))
		expect(screen.getByText('Corte de cabello'))
		// appointment 2
		expect(screen.getByText('María López'))
		expect(screen.getByText('11:30 AM'))
		expect(screen.getByText('Manicure'))
	})

	it('should display the earnings chart section', () => {
		render(<DashboardPage />)
		expect(screen.getByText('Ganancias'))
		// check for the presence of the chart (assuming it's an SVG element)
		const chart = screen.getByTestId('earnings-chart')
		expect(chart)
	})
})
