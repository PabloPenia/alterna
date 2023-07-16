'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard } from '@prisma/client'
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
	label: z.string().min(1),
	imageUrl: z.string().min(1),
})
type BillboardFormValues = z.infer<typeof formSchema>
type Props = {
	initialData: Billboard | null
}

export default function BillboardForm({ initialData }: Props) {
	const params = useParams()
	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const title = initialData ? 'Editar Billboard' : 'Crear nuevo Billboard'
	const description = initialData
		? 'Editar el Billboard'
		: 'Crear un nuevo Billboard'
	const toastMessage = initialData
		? 'Billboard actualizado correctamente.'
		: 'Billboard creado correctamente.'
	const action = initialData ? 'Guardar cambios' : 'Crear Billboard'

	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			label: '',
			imageUrl: '',
		},
	})

	const onSubmit = async (data: BillboardFormValues) => {
		try {
			setIsLoading(true)
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/billboards/${params.billboardId}`,
					data
				)
			} else {
				await axios.post(`/api/${params.storeId}/billboards`, data)
			}
			router.refresh()
			toast.success(toastMessage)
			router.push(`/${params.storeId}/billboards`)
		} catch (error) {
			toast.error('Ha ocurrido un error.')
		} finally {
			setIsLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setIsLoading(true)
			await axios.delete(
				`/api/${params.storeId}/billboards/${params.billboardId}`
			)
			router.refresh()
			router.push(`/${params.storeId}/billboards`)
			toast.success('Billboard eliminado.')
		} catch (error) {
			toast.error(
				'Asegurate de haber eliminado todas las categorias que utilizen este billboard primero.'
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
					<FormField
						control={form.control}
						name='imageUrl'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Imagen de fondo</FormLabel>
								<FormControl>
									<ImageUpload
										disabled={isLoading}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange('')}
										value={field.value ? [field.value] : []}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='label'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Texto</FormLabel>
									<FormControl>
										<Input
											disabled={isLoading}
											placeholder='Etiqueta del billboard'
											{...field}
										/>
									</FormControl>
									<FormMessage />
									<Button
										disabled={isLoading}
										className='ml-auto'
										type='submit'
									>
										{action}
									</Button>
								</FormItem>
							)}
						/>
					</div>
				</form>
			</Form>
		</>
	)
}
