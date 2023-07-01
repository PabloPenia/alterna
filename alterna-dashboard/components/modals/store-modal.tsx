'usew client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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
import { Button } from '../ui/button'

const formSchema = z.object({
	name: z.string().min(1),
})

export default function StoreModal() {
	const storeModal = useStoreModal()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values)
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
											<Input placeholder='ecommerce' {...field} />
										</FormControl>
										<FormMessage></FormMessage>
									</FormItem>
								)}
							/>
							<div className='pt-6 space-x-2 flex items-center justify-end w-full'>
								<Button variant='outline' onClick={storeModal.onClose}>
									Cancel
								</Button>
								<Button type='submit'>Continue</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</Modal>
	)
}
