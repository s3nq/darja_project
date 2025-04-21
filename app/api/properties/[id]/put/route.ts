import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const data = await req.json()

		const updated = await prisma.property.update({
			where: { id: Number(params.id) },
			data: {
				...data,
			},
		})

		return NextResponse.json(updated)
	} catch (error) {
		console.error('Ошибка при обновлении объекта:', error)
		return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 })
	}
}
