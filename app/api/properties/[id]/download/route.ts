import { readFileSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { encodeURIComponent } from 'querystring'

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { searchParams } = new URL(req.url)
	const type = searchParams.get('type')

	if (!type) {
		return NextResponse.json({ error: 'No type specified' }, { status: 400 })
	}

	try {
		const filePath = join(
			process.cwd(),
			'public',
			'uploads',
			params.id,
			`${type}.pdf`
		)

		const fileBuffer = readFileSync(filePath)

		// Кодируем имя файла
		const encodedName = encodeURIComponent(`${type}.pdf`)

		return new NextResponse(fileBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename*=UTF-8''${encodedName}`,
			},
		})
	} catch (error) {
		console.error('Ошибка при скачивании файла:', error)
		return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
	}
}
