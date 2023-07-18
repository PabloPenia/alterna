import getBillboard from '@/actions/get-billboards'
import getProducts from '@/actions/get-products'
import Billboard from '@/components/billboard'
import ProductList from '@/components/product-list'
import Container from '@/components/ui/container'

export const revalidate = 0

export default async function HomePage() {
	const products = await getProducts({ isFeatured: true })
	const billboard = await getBillboard('9b1c72d8-82e4-4bd7-a406-ac7e31c1876a')
	return (
		<Container>
			<div className='space-y-10 pb-10'>
				<Billboard data={billboard} />
				<div className='flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8'>
					<ProductList title='Productos Destacados' items={products} />
				</div>
			</div>
		</Container>
	)
}
