'use client'

import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { OrderColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

type ComponentProps = {
	data: OrderColumn[]
}

export default function OrderClient({ data }: ComponentProps) {
	return (
		<>
			<Heading
				title={`Ordenes (${data.length})`}
				description='Gestionar las ordenes de la tienda.'
			/>
			<Separator />
			<DataTable columns={columns} data={data} searchKey='products' />
		</>
	)
}
