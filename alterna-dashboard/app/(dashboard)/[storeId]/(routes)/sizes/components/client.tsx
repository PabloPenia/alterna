'use client'

import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { SizeColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'

type ComponentProps = {
	data: SizeColumn[]
}

export default function SizeClient({ data }: ComponentProps) {
	const router = useRouter()
	const params = useParams()
	return (
		<>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Sizes (${data.length})`}
					description='Gestionar los talles de productos de la tienda.'
				/>
				<Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
					<Plus className='mr-2 h-4 w-4' />
					Nuevo
				</Button>
			</div>
			<Separator />
			<DataTable columns={columns} data={data} searchKey='name' />
			<Heading title='API' description='Rutas de la API para talles' />
			<Separator />
			<ApiList entityName='sizes' entityId='sizeId ' />
		</>
	)
}
