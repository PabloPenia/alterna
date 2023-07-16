import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'

import prismadb from '@/lib/prismadb'
import Navbar from '@/components/navbar'

export const metadata = {
	title: 'Admin Dashboard',
	description: 'Admin Dashboard',
}

type LayoutProps = {
	children: React.ReactNode
	params: { storeId: string }
}

export default async function DashboardLayout({
	children,
	params,
}: LayoutProps) {
	const { userId } = auth()

	if (!userId) redirect('/sign-in')

	const store = await prismadb.store.findFirst({
		where: {
			id: params.storeId,
			userId,
		},
	})

	if (!store) redirect('/')

	return (
		<>
			<Navbar />
			{children}
		</>
	)
}
