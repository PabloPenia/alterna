'use client'

import { useEffect, useState } from 'react'

type Props = {
	value?: string | number
}

const formatter = new Intl.NumberFormat('es-UY', {
	style: 'currency',
	currency: 'UYU',
})
export default function Currency({ value }: Props) {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	return <div className='font-semibold'>{formatter.format(Number(value))}</div>
}
