import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
	_req: Request,
	{ params }: { params: { categoryId: string } }
) {
	try {
		if (!params.categoryId) {
			return new NextResponse('El id de la categoría es requerido', {
				status: 400,
			})
		}

		const category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			},
			include: {
				billboard: true,
			},
		})

		return NextResponse.json(category)
	} catch (error) {
		console.log('[CATEGORY_GET]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth()
		const body = await req.json()
		const { name, billboardId } = body

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 403 })
		}

		if (!name) {
			return new NextResponse('El nombre es requerido.', { status: 400 })
		}

		if (!billboardId) {
			return new NextResponse('Se requiere un billboardId.', { status: 400 })
		}

		if (!params.categoryId) {
			return new NextResponse('El id de la categoría es requerida.', {
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

		const category = await prismadb.category.updateMany({
			where: {
				id: params.categoryId,
			},
			data: {
				name,
				billboardId,
			},
		})

		return NextResponse.json(category)
	} catch (error) {
		console.log('[CATEGORY_PATCH]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth()
		if (!userId) {
			return new NextResponse('Sin auntenticar.', { status: 403 })
		}

		if (!params.categoryId) {
			return new NextResponse('El id de la categoría es requerida', {
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

		const category = await prismadb.category.delete({
			where: {
				id: params.categoryId,
			},
		})

		return NextResponse.json(category)
	} catch (error) {
		console.log('[CATEGORY_DELETE]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}
