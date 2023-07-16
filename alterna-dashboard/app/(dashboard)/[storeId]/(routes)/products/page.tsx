import { format } from 'date-fns'
import prismadb from '@/lib/prismadb'
import { formatter } from '@/lib/utils'
import { ProductColumn } from './components/columns'
import ProductClient from './components/client'

type PageProps = {
	params: {
		storeId: string
	}
}

export default async function ProductsPage({ params }: PageProps) {
	const products = await prismadb.product.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			category: true,
			size: true,
			color: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	const formattedProducts: ProductColumn[] = products.map((item) => ({
		id: item.id,
		name: item.name,
		price: formatter.format(item.price.toNumber()),
		category: item.category.name,
		size: item.size.name,
		color: item.color.value,
		isFeatured: item.isFeatured,
		isArchived: item.isArchived,
		createdAt: format(item.createdAt, 'do MMMM, yyyy'),
	}))

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<ProductClient data={formattedProducts} />
			</div>
		</div>
	)
}
