'usew client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'

import { useStoreModal } from '@/hooks/useStoreModal'
import Modal from '@/components/ui/modal'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'

const formSchema = z.object({
	name: z.string().min(1),
})

export default function StoreModal() {
	const storeModal = useStoreModal()
	const [isLoading, setIsLoading] = useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setIsLoading(true)
			const response = await axios.post('/api/stores', values)

			window.location.assign(`/${response.data.id}`) // redirect and refresh
		} catch (error) {
			toast.error('Ha ocurrido un error.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Modal
			title='crear tienda'
			description='crear una tienda nueva para gestionar productos y categorias'
			isOpen={storeModal.isOpen}
			onClose={storeModal.onClose}
		>
			<div>
				<div className='space-y-4 py-2 pb4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder='ecommerce'
												{...field}
											/>
										</FormControl>
										<FormMessage></FormMessage>
									</FormItem>
								)}
							/>
							<div className='pt-6 space-x-2 flex items-center justify-end w-full'>
								<Button
									disabled={isLoading}
									variant='outline'
									onClick={storeModal.onClose}
								>
									Cancel
								</Button>
								<Button disabled={isLoading} type='submit'>
									Continue
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</Modal>
	)
}
