import { readFileSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id
	const type = decodeURIComponent(
		request.nextUrl.searchParams.get('type') || ''
	)

	try {
		const filePath = join(process.cwd(), 'public', 'uploads', id, `${type}.pdf`)

		const fileBuffer = readFileSync(filePath)
		return new NextResponse(fileBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${encodeURIComponent(
					`${type}.pdf`
				)}"`,
			},
		})
	} catch (error) {
		console.error('Ошибка при скачивании файла:', error)
		return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
	}
}
