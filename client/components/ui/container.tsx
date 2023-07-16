type Props = {
	children: React.ReactNode
}

export default function Container({ children }: Props) {
	return <div className='mx-auto max-w-7xl'>{children}</div>
}
