import getBillboard from '@/actions/get-billboards'
import getProducts from '@/actions/get-products'
import Billboard from '@/components/billboard'
import ProductList from '@/components/product-list'
import Container from '@/components/ui/container'

export const revalidate = 0

export default async function HomePage() {
	const products = await getProducts({ isFeatured: true })
	const billboard = await getBillboard('1101eb0e-fc3b-4b8c-ab40-c1a5489f8cd8')
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
