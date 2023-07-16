'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProductColumn } from './columns'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import AlertModal from '@/components/modals/alert-modal'

type ComponentProps = {
	data: ProductColumn
}

export default function CellAction({ data }: ComponentProps) {
	const router = useRouter()
	const params = useParams()
	const [isLoading, setIsLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id)
		toast.success('El ID del producto se ha copiado al portapapeles')
	}

	const onDelete = async () => {
		try {
			setIsLoading(true)
			await axios.delete(`/api/${params.storeId}/products/${data.id}`)
			router.refresh()
			toast.success('Producto eliminado.')
		} catch (error) {
			toast.error('Ha ocurrido un error.')
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
						onClick={() =>
							router.push(`/${params.storeId}/products/${data.id}`)
						}
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
