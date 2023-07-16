'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Category, Color, Image, Product, Size } from '@prisma/client'
import { Trash } from 'lucide-react'
import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import {
	Form,
	FormControl,
	FormDescription,
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const formSchema = z.object({
	name: z.string().min(1),
	images: z.object({ url: z.string().min(1) }).array(),
	price: z.coerce.number().min(1),
	categoryId: z.string().min(1),
	colorId: z.string().min(1),
	sizeId: z.string().min(1),
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional(),
})
type ProductFormValues = z.infer<typeof formSchema>
type Props = {
	initialData: (Product & { images: Image[] }) | null
	categories: Category[]
	colors: Color[]
	sizes: Size[]
}

export default function ProductForm({
	categories,
	colors,
	sizes,
	initialData,
}: Props) {
	const params = useParams()
	const router = useRouter()

	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const title = initialData ? 'Editar Producto' : 'Crear nuevo Producto'
	const description = initialData
		? 'Editar el Producto'
		: 'Crear un nuevo Producto'
	const toastMessage = initialData
		? 'Producto actualizado correctamente.'
		: 'Producto creado correctamente.'
	const action = initialData ? 'Guardar cambios' : 'Crear Producto'

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? { ...initialData, price: parseFloat(String(initialData?.price)) }
			: {
					name: '',
					images: [],
					price: 0,
					categoryId: '',
					colorId: '',
					sizeId: '',
					isFeatured: false,
					isArchived: false,
			  },
	})

	const onSubmit = async (data: ProductFormValues) => {
		try {
			setIsLoading(true)
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/products/${params.productId}`,
					data
				)
			} else {
				await axios.post(`/api/${params.storeId}/products`, data)
			}
			router.refresh()
			toast.success(toastMessage)
			router.push(`/${params.storeId}/products`)
		} catch (error) {
			toast.error('Ha ocurrido un error.')
		} finally {
			setIsLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setIsLoading(true)
			await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
			router.refresh()
			router.push(`/${params.storeId}/products`)
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
						name='images'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Imagenes</FormLabel>
								<FormControl>
									<ImageUpload
										disabled={isLoading}
										value={field.value.map((image) => image.url)}
										onChange={(url) =>
											field.onChange([...field.value, { url }])
										}
										onRemove={(url) =>
											field.onChange([
												...field.value.filter((current) => current.url !== url),
											])
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
											placeholder='Nombre del producto'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Precio</FormLabel>
									<FormControl>
										<Input disabled={isLoading} placeholder='9.99' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='categoryId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Categoría</FormLabel>
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
													placeholder='Selecciona una categoría'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map(({ id, name }) => (
												<SelectItem key={id} value={id}>
													{name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='sizeId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Talle</FormLabel>
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
													placeholder='Selecciona un talle'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{sizes.map(({ id, name }) => (
												<SelectItem key={id} value={id}>
													{name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='colorId'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Color</FormLabel>
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
													placeholder='Selecciona un color'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{colors.map(({ id, name }) => (
												<SelectItem key={id} value={id}>
													{name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='isFeatured'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Destacado</FormLabel>
										<FormDescription>
											El producto aparecerá en la portada.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='isArchived'
							render={({ field }) => (
								<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
									<FormControl>
										<Checkbox
											checked={field.value}
											// @ts-ignore
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<div className='space-y-1 leading-none'>
										<FormLabel>Archivar</FormLabel>
										<FormDescription>
											El producto no aparecerá en ningún sitio de la tienda.
										</FormDescription>
									</div>
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
