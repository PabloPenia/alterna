'use client'

import Button from '@/components/ui/button'
import IconButton from '@/components/ui/icon-button'
import { ColorType, SizeType } from '@/types'
import { Dialog } from '@headlessui/react'
import { Plus, X } from 'lucide-react'
import { MouseEvent, useState } from 'react'
import Filter from './filter'

type Props = {
	sizes: SizeType[]
	colors: ColorType[]
}

export default function MobileFilter({ sizes, colors }: Props) {
	const [isOpen, setIsOpen] = useState(false)

	const onOpen = () => setIsOpen(true)
	const onClose = () => setIsOpen(false)

	return (
		<>
			<Button onClick={onOpen} className='flex items-center gap-x-2 lg:hidden'>
				Filtros
				<Plus size={20} />
			</Button>
			<Dialog
				open={isOpen}
				onClose={onClose}
				as='div'
				className='relative z-40 lg:hidden'
			>
				{/* BG */}
				<div className='fixed inset-0 bg-black bg-opacity-25' />
				{/* POS */}
				<div className='fixed inset-0 z-40 flex'>
					<Dialog.Panel className='relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl'>
						{/* CLOSE */}
						<div className='flex items-center justify-end px-4'>
							<IconButton onClick={onClose} icon={<X size={15} />} />
						</div>
						{/* FILTERS */}
						<div className='p-4'>
							<Filter valueKey='sizeId' name='Talles' data={sizes} />
							<Filter valueKey='colorId' name='Colores' data={colors} />
						</div>
					</Dialog.Panel>
				</div>
			</Dialog>
		</>
	)
}
