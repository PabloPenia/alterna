'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Color } from '@prisma/client'
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

const formSchema = z.object({
	name: z.string().min(2),
	value: z.string().min(4).max(9).regex(/^#/, {
		message: 'Debe ingresar un codigo hexadecimal valido.',
	}),
})
type ColorFormValues = z.infer<typeof formSchema>
type Props = {
	initialData: Color | null
}

export default function ColorForm({ initialData }: Props) {
	const params = useParams()
	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const title = initialData ? 'Editar color' : 'Crear nuevo color'
	const description = initialData ? 'Editar el color' : 'Crear un nuevo color'
	const toastMessage = initialData
		? 'Color actualizado correctamente.'
		: 'Color creado correctamente.'
	const action = initialData ? 'Guardar cambios' : 'Crear color'

	const form = useForm<ColorFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			value: '',
		},
	})

	const onSubmit = async (data: ColorFormValues) => {
		try {
			setIsLoading(true)
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/colors/${params.colorId}`,
					data
				)
			} else {
				await axios.post(`/api/${params.storeId}/colors`, data)
			}
			router.refresh()
			router.push(`/${params.storeId}/colors`)
			toast.success(toastMessage)
		} catch (error) {
			toast.error('Ha ocurrido un error.')
		} finally {
			setIsLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setIsLoading(true)
			await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
			router.refresh()
			router.push(`/${params.storeId}/colors`)
			toast.success('Color eliminado.')
		} catch (error) {
			toast.error(
				'Asegurate de haber eliminado todos los productos que utilizen este color primero.'
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
											placeholder='Nombre del color'
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
										<div className='flex items-center gap-x-4'>
											<Input
												disabled={isLoading}
												placeholder='Color en HEX'
												{...field}
											/>
											<div
												className='border p-4 rounded-full'
												style={{ backgroundColor: field.value }}
											/>
										</div>
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
