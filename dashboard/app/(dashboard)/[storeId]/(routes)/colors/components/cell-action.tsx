'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import AlertModal from '@/components/modals/alert-modal'
import { ColorColumn } from './columns'

type ComponentProps = {
	data: ColorColumn
}

export default function CellAction({ data }: ComponentProps) {
	const router = useRouter()
	const params = useParams()
	const [isLoading, setIsLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id)
		toast.success('El ID del color se ha copiado al portapapeles')
	}

	const onDelete = async () => {
		try {
			setIsLoading(true)
			await axios.delete(`/api/${params.storeId}/colors/${data.id}`)
			toast.success('Color eliminado.')
			router.refresh()
		} catch (error) {
			toast.error(
				'Asegurate de haber eliminado todas los productos que utilizen este color primero.'
			)
		} finally {
			setIsLoading(false)
			setIsOpen(false)
		}
	}
	return (
		<>
			<AlertModal
				isLoading={isLoading}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onConfirm={onDelete}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' className='h-8 w-8 p-0'>
						<span className='sr-only'>Abrir menu</span>
						<MoreHorizontal className='h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end'>
					<DropdownMenuLabel>Acciones</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className='mr-2 h-4 w-4' />
						Copiar Id
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}
					>
						<Edit className='mr-2 h-4 w-4' />
						Actualizar
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsOpen(true)}>
						<Trash className='mr-2 h-4 w-4' />
						Eliminar
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
