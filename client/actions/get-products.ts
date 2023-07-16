import { ProductType } from '@/types'
import qs from 'query-string'

type Query = {
	categoryId?: string
	colorId?: string
	sizeId?: string
	isFeatured?: boolean
}

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

export default async function getProducts(
	query: Query
): Promise<ProductType[]> {
	const url = qs.stringifyUrl({ url: URL, query })
	const res = await fetch(url)

	return res.json()
}
