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
		const { name, billboardId } = body

		if (!name) {
			return new NextResponse('El nombre es requerido.', {
				status: 400,
			})
		}

		if (!billboardId) {
			return new NextResponse('Se requiere seleccionar un billboard.', {
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

		const category = await prismadb.category.create({
			data: {
				name,
				billboardId,
				storeId: params.storeId,
			},
		})

		return NextResponse.json(category)
	} catch (error) {
		console.log('[CATEGORY_POST] Ha ocurrido un error.', error)

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

		const categories = await prismadb.category.findMany({
			where: {
				storeId: params.storeId,
			},
		})

		return NextResponse.json(categories)
	} catch (error) {
		console.log('[CATEGORIES_GET] Ha ocurrido un error.', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}
