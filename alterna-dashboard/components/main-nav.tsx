'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

export default function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname()
	const params = useParams()
	const routes = [
		{
			href: `/${params.storeId}`,
			label: 'Escritorio',
			active: pathname === `/${params.storeId}`,
		},
		{
			href: `/${params.storeId}/billboards`,
			label: 'Billboards',
			active: pathname === `/${params.storeId}/billboards`,
		},
		{
			href: `/${params.storeId}/categories`,
			label: 'Categorias',
			active: pathname === `/${params.storeId}/billboards`,
		},
		{
			href: `/${params.storeId}/sizes`,
			label: 'Talles',
			active: pathname === `/${params.storeId}/sizes`,
		},
		{
			href: `/${params.storeId}/colors`,
			label: 'Colores',
			active: pathname === `/${params.storeId}/colors`,
		},
		{
			href: `/${params.storeId}/products`,
			label: 'Productos',
			active: pathname === `/${params.storeId}/products`,
		},
		{
			href: `/${params.storeId}/orders`,
			label: 'Ordenes',
			active: pathname === `/${params.storeId}/orders`,
		},
		{
			href: `/${params.storeId}/settings`,
			label: 'Preferencias',
			active: pathname === `/${params.storeId}/settings`,
		},
	]
	return (
		<nav
			className={cn('flex items-center space-x-4 lg:space-x-6', className)}
			{...props}
		>
			{routes.map(({ href, label, active }) => (
				<Link
					key={href}
					href={href}
					className={cn(
						'text-sm font-medium transition-colors hover:text-primary',
						active ? 'text-black dark:text-white' : 'text-muted-foreground'
					)}
				>
					{label}
				</Link>
			))}
		</nav>
	)
}
