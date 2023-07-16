'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Size } from '@prisma/client'
import { Trash } from 'lucide-react'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import AlertModal from '@/components/modals/alert-modal'
import ImageUpload from '@/components/ui/image-upload'

const formSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(1),
})
type SizeFormValues = z.infer<typeof formSchema>
type Props = {
	initialData: Size | null
}

export default function SizeForm({ initialData }: Props) {
	const params = useParams()
	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const title = initialData ? 'Editar talle' : 'Crear nuevo talle'
	const description = initialData ? 'Editar el talle' : 'Crear un nuevo talle'
	const toastMessage = initialData
		? 'Talle actualizado correctamente.'
		: 'Talle creado correctamente.'
	const action = initialData ? 'Guardar cambios' : 'Crear talle'

	const form = useForm<SizeFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			value: '',
		},
	})

	const onSubmit = async (data: SizeFormValues) => {
		try {
			setIsLoading(true)
			if (initialData) {
				await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
			} else {
				await axios.post(`/api/${params.storeId}/sizes`, data)
			}
			router.refresh()
			toast.success(toastMessage)
			router.push(`/${params.storeId}/sizes`)
		} catch (error) {
			toast.error('Ha ocurrido un error.')
		} finally {
			setIsLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setIsLoading(true)
			await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
			router.refresh()
			router.push(`/${params.storeId}/sizes`)
			toast.success('Talle eliminado.')
		} catch (error) {
			toast.error(
				'Asegurate de haber eliminado todos los productos que utilizen este talle primero.'
			)
		} finally {
			setIsLoading(false)
			setIsOpen(false)
		}
	}

	return (
		<>
			<AlertModal
				isOpen={isOpen}
				isLoading={isLoading}
				onClose={() => {
					setIsOpen(false)
				}}
				onConfirm={onDelete}
			/>
			<div className='flex items-center justify-between'>
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={isLoading}
						variant='destructive'
						size='icon'
						onClick={() => setIsOpen(true)}
					>
						<Trash className='h-4 w-4' />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 w-full'
				>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder='Nombre del talle'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='value'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Valor</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder='Valor del talle'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={isLoading} className='ml-auto' type='submit'>
						{action}
					</Button>
				</form>
			</Form>
		</>
	)
}
