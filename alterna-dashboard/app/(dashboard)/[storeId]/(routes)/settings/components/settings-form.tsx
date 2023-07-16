'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Store } from '@prisma/client'
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
import ApiAlert from '@/components/ui/api-alert'
import useOrigin from '@/hooks/useOrigin'

const formSchema = z.object({
	name: z.string().min(1),
})
type SettingsFormValues = z.infer<typeof formSchema>
type Props = {
	initialData: Store
}

export default function SettingsForm({ initialData }: Props) {
	const params = useParams()
	const router = useRouter()
	const origin = useOrigin()

	const [isOpen, setIsOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<SettingsFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	})

	const onSubmit = async (data: SettingsFormValues) => {
		try {
			setIsLoading(true)
			await axios.patch(`/api/stores/${params.storeId}`, data)
			router.refresh()
			toast.success('Tienda actualizada')
		} catch (error) {
			toast.error('Ha ocurrido un error.')
		} finally {
			setIsLoading(false)
		}
	}

	const onDelete = async () => {
		try {
			setIsLoading(true)
			await axios.delete(`/api/stores/${params.storeId}`)
			router.refresh()
			router.push('/')
			toast.success('Tienda eliminada.')
		} catch (error) {
			toast.error(
				'Asegurate de haber eliminado todos los productos y categorias primero.'
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
				<Heading
					title='preferencias'
					description='Editar las preferencias de la tienda'
				/>
				<Button
					disabled={isLoading}
					variant='destructive'
					size='icon'
					onClick={() => setIsOpen(true)}
				>
					<Trash className='h-4 w-4' />
				</Button>
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
											placeholder='nombre de la tienda'
											{...field}
										/>
									</FormControl>
									<FormMessage />
									<Button
										disabled={isLoading}
										className='ml-auto'
										type='submit'
									>
										Guardar cambios
									</Button>
								</FormItem>
							)}
						/>
					</div>
				</form>
			</Form>
			<Separator />
			<ApiAlert
				title='NEXT_PUBLIC_API_URL'
				description={`${origin}/api/${params.storeId}`}
				variant='public'
			/>
		</>
	)
}
