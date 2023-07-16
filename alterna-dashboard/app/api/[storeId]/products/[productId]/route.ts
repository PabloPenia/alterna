import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
	_req: Request,
	{ params }: { params: { productId: string } }
) {
	try {
		if (!params.productId) {
			return new NextResponse('El id del producto es requerido', {
				status: 400,
			})
		}

		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			},
			include: {
				images: true,
				category: true,
				color: true,
				size: true,
			},
		})

		return NextResponse.json(product)
	} catch (error) {
		console.log('[PRODUCT_GET]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		const { userId } = auth()
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

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 403 })
		}

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

		if (!params.productId) {
			return new NextResponse('El id del product es requerido.', {
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

		await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				name,
				price,
				categoryId,
				colorId,
				sizeId,
				images: {
					deleteMany: {},
				},
				isFeatured,
				isArchived,
			},
		})

		const product = await prismadb.product.update({
			where: {
				id: params.productId,
			},
			data: {
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		})

		return NextResponse.json(product)
	} catch (error) {
		console.log('[PRODUCT_PATCH]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		const { userId } = auth()
		if (!userId) {
			return new NextResponse('Sin auntenticar.', { status: 403 })
		}

		if (!params.productId) {
			return new NextResponse('El id del producto es requerido', {
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
				status: 405,
			})
		}

		const product = await prismadb.product.delete({
			where: {
				id: params.productId,
			},
		})

		return NextResponse.json(product)
	} catch (error) {
		console.log('[PRODUCT_DELETE]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}
