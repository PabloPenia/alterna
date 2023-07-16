import prismadb from '@/lib/prismadb'
import { ColorColumn } from './components/columns'
import { format } from 'date-fns'
import ColorClient from './components/client'

type PageProps = {
	params: {
		storeId: string
	}
}

export default async function ColorsPage({ params }: PageProps) {
	const colors = await prismadb.color.findMany({
		where: {
			storeId: params.storeId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	const formattedColors: ColorColumn[] = colors.map(
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
				<ColorClient data={formattedColors} />
			</div>
		</div>
	)
}
