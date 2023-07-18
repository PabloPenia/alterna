import { CategoryType } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`

export default async function getCategory(id: string): Promise<CategoryType> {
	const res = await fetch(`${URL}/${id}`)

	return res.json()
}
