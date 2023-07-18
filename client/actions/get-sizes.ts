import { SizeType } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/sizes`

export default async function getSizes(): Promise<SizeType[]> {
	const res = await fetch(URL)

	return res.json()
}
