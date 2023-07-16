'use client'

import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { CategoryColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

type ComponentProps = {
	data: CategoryColumn[]
}

export default function CategoryClient({ data }: ComponentProps) {
	const router = useRouter()
	const params = useParams()
	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Categorías (${data.length})`}
					description='Gestionar las categorías de la tienda.'
				/>
				<Button
					onClick={() => router.push(`/${params.storeId}/categories/new`)}
				>
					<Plus className='mr-2 h-4 w-4' />
					Nuevo
				</Button>
			</div>
			<Separator />
			<DataTable columns={columns} data={data} searchKey='name ' />
			<Heading title='API' description='Rutas de la API para categorías' />
			<Separator />
			<ApiList entityName='categories' entityId='categoryId' />
		</>
	)
}
