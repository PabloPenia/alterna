import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function GET(
	_req: Request,
	{ params }: { params: { billboardId: string } }
) {
	try {
		if (!params.billboardId) {
			return new NextResponse('El id del billboard es requerido', {
				status: 400,
			})
		}

		const billboard = await prismadb.billboard.findUnique({
			where: {
				id: params.billboardId,
			},
		})

		return NextResponse.json(billboard)
	} catch (error) {
		console.log('[BILLBOARD_GET]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth()
		const body = await req.json()
		const { label, imageUrl } = body

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 403 })
		}

		if (!label) {
			return new NextResponse('La etiqueta es requerida.', { status: 400 })
		}

		if (!imageUrl) {
			return new NextResponse('La imagen es requerida.', { status: 400 })
		}

		if (!params.billboardId) {
			return new NextResponse('El id del billboard es requerido.', {
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

		const billboard = await prismadb.billboard.updateMany({
			where: {
				id: params.billboardId,
			},
			data: {
				label,
				imageUrl,
			},
		})

		return NextResponse.json(billboard)
	} catch (error) {
		console.log('[BILLBOARD_PATCH]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth()
		if (!userId) {
			return new NextResponse('Sin auntenticar.', { status: 403 })
		}

		if (!params.billboardId) {
			return new NextResponse('El id del billboard es requerido', {
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

		const billboard = await prismadb.billboard.delete({
			where: {
				id: params.billboardId,
			},
		})

		return NextResponse.json(billboard)
	} catch (error) {
		console.log('[BILLBOARD_DELETE]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}
