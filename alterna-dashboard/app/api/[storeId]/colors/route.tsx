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

		const color = await prismadb.color.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		})

		return NextResponse.json(color)
	} catch (error) {
		console.log('[COLORS_POST] Ha ocurrido un error.', error)

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

		const colors = await prismadb.color.findMany({
			where: {
				storeId: params.storeId,
			},
		})

		return NextResponse.json(colors)
	} catch (error) {
		console.log('[COLORS_GET] Ha ocurrido un error.', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}
