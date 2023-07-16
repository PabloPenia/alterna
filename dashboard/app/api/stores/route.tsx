import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

import prismadb from '@/lib/prismadb'

export async function POST(req: Request) {
	try {
		const { userId } = auth()

		if (!userId) {
			return new NextResponse('No tienes permiso para acceder a esta página', {
				status: 401,
			})
		}

		const body = await req.json()
		const { name } = body

		if (!name) {
			return new NextResponse('El nombre es requerido.', {
				status: 400,
			})
		}

		const store = await prismadb.store.create({
			data: {
				name,
				userId,
			},
		})

		return NextResponse.json(store)
	} catch (error) {
		console.log('[STORES_POST] Something went wrong.', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}
