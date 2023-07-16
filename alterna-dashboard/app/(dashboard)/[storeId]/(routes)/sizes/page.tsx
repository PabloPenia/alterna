import prismadb from '@/lib/prismadb'
import { SizeColumn } from './components/columns'
import { format } from 'date-fns'
import SizeClient from './components/client'

type PageProps = {
	params: {
		storeId: string
	}
}

export default async function SizesPage({ params }: PageProps) {
	const sizes = await prismadb.size.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	const formattedSizes: SizeColumn[] = sizes.map(
		({ id, name, value, createdAt }) => ({
			id,
			name,
			value,
			createdAt: format(createdAt, 'do MMMM, yyyy'),
		})
	)

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<SizeClient data={formattedSizes} />
			</div>
		</div>
	)
}
