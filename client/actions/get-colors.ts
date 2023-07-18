import { ColorType } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/colors`

export default async function getColors(): Promise<ColorType[]> {
	const res = await fetch(URL)

	return res.json()
}
