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
		const {
			name,
			price,
			categoryId,
			colorId,
			sizeId,
			images,
			isFeatured,
			isArchived,
		} = body

		if (!name) {
			return new NextResponse('El nombre es requerida.', {
				status: 400,
			})
		}

		if (!price) {
			return new NextResponse('El precio es requerido.', {
				status: 400,
			})
		}

		if (!categoryId) {
			return new NextResponse('La categoria es requerida.', {
				status: 400,
			})
		}

		if (!colorId) {
			return new NextResponse('El color es requerido.', {
				status: 400,
			})
		}

		if (!sizeId) {
			return new NextResponse('El talle es requerido.', {
				status: 400,
			})
		}

		if (!images || !images.length) {
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

		const product = await prismadb.product.create({
			data: {
				name,
				price,
				categoryId,
				colorId,
				sizeId,
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
				isFeatured,
				isArchived,
				storeId: params.storeId,
			},
		})

		return NextResponse.json(product)
	} catch (error) {
		console.log('[PRODUCTS_POST] Ha ocurrido un error.', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { searchParams } = new URL(req.url)
		const categoryId = searchParams.get('categoryId') || undefined
		const colorId = searchParams.get('colorId') || undefined
		const sizeId = searchParams.get('sizeId') || undefined
		const isFeatured = searchParams.get('isFeatured')

		if (!params.storeId) {
			return new NextResponse('Se requiere un id de tienda.', {
				status: 400,
			})
		}

		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
				colorId,
				sizeId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false,
			},
			include: {
				images: true,
				category: true,
				color: true,
				size: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return NextResponse.json(products)
	} catch (error) {
		console.log('[PRODUCTS_GET] Ha ocurrido un error.', error)

		return new NextResponse('Internal error', { status: 500 })
	}
}
