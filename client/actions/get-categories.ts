import { CategoryType } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`

export default async function getCategories(): Promise<CategoryType[]> {
	const res = await fetch(URL)

	return res.json()
}
