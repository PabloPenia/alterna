'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Billboard, Category } from '@prisma/client'
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
	name: z.string().min(1),
	billboardId: z.string().min(1),
})
type CategoryFormValues = z.infer<typeof formSchema>
type Props = {
	initialData: Category | null
	billboards: Billboard[]
}

export default function CategoryForm({ billboards, initialData }: Props) {
	const params = useParams()
	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const title = initialData ? 'Editar categoría' : 'Crear nueva categoría'
	const description = initialData
		? 'Editar la categoría'
		: 'Crear un nueva categoría'
	const toastMessage = initialData
		? 'Categoría actualizada correctamente.'
		: 'Categoría creada correctamente.'
	const action = initialData ? 'Guardar cambios' : 'Crear Categoría'

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			billboardId: '',
		},
	})

	const onSubmit = async (data: CategoryFormValues) => {
		try {
			setIsLoading(true)
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/categories/${params.categoryId}`,
					data
				)
			} else {
				await axios.post(`/api/${params.storeId}/categories`, data)
			}
			router.refresh()
			toast.success(toastMessage)
			router.push(`/${params.storeId}/categories`)
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
				`/api/${params.storeId}/categories/${params.categoryId}`
			)
			router.refresh()
			router.push(`/${params.storeId}/categories`)
			toast.success('Categoría eliminada.')
		} catch (error) {
			toast.error(
				'Asegurate de haber eliminado todos los productos que utilizen esta categoría primero.'
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
											placeholder='Nombre de la categoría'
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
						<FormField
							control={form.control}
							name='billboardId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Billboard</FormLabel>
									<Select
										disabled={isLoading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className='w-[180px]'>
												<SelectValue
													defaultValue={field.value}
													placeholder='Selecciona un billboard'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{billboards.map(({ id, label }) => (
												<SelectItem key={id} value={id}>
													{label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</form>
			</Form>
		</>
	)
}
