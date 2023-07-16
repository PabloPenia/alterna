'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

type ModalProps = {
	isLoading: boolean
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
}

export default function AlertModal({
	isLoading,
	isOpen,
	onClose,
	onConfirm,
}: ModalProps) {
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	if (!isMounted) {
		return null
	}

	return (
		<Modal
			title='Estas seguro?'
			description='Esta acción no puede deshacerse.'
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className='pt-6 space-x-2 flex items-center justify-end w-full'>
				<Button disabled={isLoading} variant='outline' onClick={onClose}>
					Cancelar
				</Button>
				<Button disabled={isLoading} variant='destructive' onClick={onConfirm}>
					Continuar
				</Button>
			</div>
		</Modal>
	)
}
