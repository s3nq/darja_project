import { existsSync, readFileSync } from 'fs'
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

	if (!type) {
		return NextResponse.json(
			{ error: 'Тип документа не указан' },
			{ status: 400 }
		)
	}

	const uploadsPath = join(
		process.cwd(),
		'public',
		'uploads',
		id,
		`${type}.pdf`
	)
	const templatePath = join(process.cwd(), 'public', 'templates', `${type}.pdf`)

	let filePath = existsSync(uploadsPath)
		? uploadsPath
		: existsSync(templatePath)
		? templatePath
		: null

	if (!filePath) {
		return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
	}

	try {
		const fileBuffer = readFileSync(filePath)

		return new NextResponse(fileBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${type}.pdf"`,
			},
		})
	} catch (err) {
		console.error('Ошибка при скачивании файла:', err)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
