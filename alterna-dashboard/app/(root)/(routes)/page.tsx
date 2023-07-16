'use client'

import { useStoreModal } from '@/hooks/useStoreModal'
// import { UserButton } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function SetupPage() {
	const onOpen = useStoreModal((state) => state.onOpen)
	const isOpen = useStoreModal((state) => state.isOpen)

	useEffect(() => {
		if (!isOpen) onOpen()
	}, [isOpen, onOpen])

	return null
	// (
	// 	<main>
	// 		<div className='p-4'>
	//
	// 		</div>
	// 	</main>
	// )
}
