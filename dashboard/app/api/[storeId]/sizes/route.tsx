import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'

import prismadb from '@/lib/prismadb'

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth()

		if (!userId) {
			return new NextResponse('No tienes permiso para acceder a esta página', {
				status: 401,
			})
		}

		const body = await req.json()
		const { name, value } = body

		if (!name) {
			return new NextResponse('El nombre es requerido.', {
				status: 400,
			})
		}

		if (!value) {
			return new NextResponse('El valor es requerido.', {
				status: 400,
			})
		}

		if (!params.storeId) {
			return new NextResponse('Se requiere un id de tienda.', {
				status: 400,
			})
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		})

		if (!storeByUserId) {
			return new NextResponse('Sin Autorizacion.', {
				status: 403,
			})
		}

		const size = await prismadb.size.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		})

		return NextResponse.json(size)
	} catch (error) {
		console.log('[SIZES_POST] Ha ocurrido un error.', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		if (!params.storeId) {
			return new NextResponse('Se requiere un id de tienda.', {
				status: 400,
			})
		}

		const sizes = await prismadb.size.findMany({
			where: {
				storeId: params.storeId,
			},
		})

		return NextResponse.json(sizes)
	} catch (error) {
		console.log('[SIZES_GET] Ha ocurrido un error.', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}
