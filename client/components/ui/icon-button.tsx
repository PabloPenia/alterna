import { cn } from '@/lib/utils'
import { MouseEventHandler } from 'react'

type Props = {
	className?: string
	onClick: MouseEventHandler<HTMLButtonElement>
	icon: React.ReactElement
}

export default function IconButton({ className, onClick, icon }: Props) {
	return (
		<button
			className={cn(
				'rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition',
				className
			)}
			onClick={onClick}
		>
			{icon}
		</button>
	)
}
