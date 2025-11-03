import { cn } from '@/lib/utils'

interface CardProps {
	title: string
	description: string
	info: string
	status: 'pending' | 'completed' | 'canceled' | '' | undefined | null
}

export function Card({ title, description, info, status }: CardProps) {
	return (
		<div>
			<div
				data-testid="card-status"
				className={cn(status === 'completed' && 'border-l-4 border-green-500')}
			></div>
			<h2>{title}</h2>
			<p>{description}</p>
			<span>{info}</span>
			<span>{status}</span>
		</div>
	)
}
