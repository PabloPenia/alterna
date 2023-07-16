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
		const { label, imageUrl } = body

		if (!label) {
			return new NextResponse('La etiqueta es requerida.', {
				status: 400,
			})
		}

		if (!imageUrl) {
			return new NextResponse('La imagen es requerida.', {
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

		const billboard = await prismadb.billboard.create({
			data: {
				label,
				imageUrl,
				storeId: params.storeId,
			},
		})

		return NextResponse.json(billboard)
	} catch (error) {
		console.log('[BILLBOARDS_POST] Ha ocurrido un error.', error)

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

		const billboards = await prismadb.billboard.findMany({
			where: {
				storeId: params.storeId,
			},
		})

		return NextResponse.json(billboards)
	} catch (error) {
		console.log('[BILLBOARDS_GET] Ha ocurrido un error.', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}
