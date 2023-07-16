import { BillboardType } from '@/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`

export default async function getBillboard(id: string): Promise<BillboardType> {
	const res = await fetch(`${URL}/${id}`)

	return res.json()
}
