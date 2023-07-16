import { ProductType } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

export default async function getProduct(id: string): Promise<ProductType> {
	const res = await fetch(`${URL}/${id}`)

	return res.json()
}
