import prismadb from '@/lib/prismadb'
import BillboardClient from './components/client'
import { BillboardColumn } from './components/columns'
import { format } from 'date-fns'

type PageProps = {
	params: {
		storeId: string
	}
}

export default async function BillboardsPage({ params }: PageProps) {
	const billboards = await prismadb.billboard.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	const formattedBillboards: BillboardColumn[] = billboards.map(
		({ id, label, createdAt }) => ({
			id,
			label,
			createdAt: format(createdAt, 'do MMMM, yyyy'),
		})
	)

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<BillboardClient data={formattedBillboards} />
			</div>
		</div>
	)
}
