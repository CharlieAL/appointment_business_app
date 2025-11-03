import type { JSX } from 'react/jsx-runtime'

interface CardStatsProps {
	label: string
	value: string
	Icon: JSX.ElementType
  onClick?: () => void
}

export function CardStats({ label, value, Icon }: CardStatsProps) {
	return (
		<div>
			<Icon />
			<h3>{label}</h3>
			<p>{value}</p>
		</div>
	)
}
