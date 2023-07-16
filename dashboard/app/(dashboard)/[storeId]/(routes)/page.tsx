import prismadb from '@/lib/prismadb'

type PageProps = {
	params: { storeId: string }
}
export default async function DashboardPage({ params }: PageProps) {
	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
		},
	})
	return (
		<div>
			<strong>Tienda activa:</strong> {store?.name}
		</div>
	)
}
