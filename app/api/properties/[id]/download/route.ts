import { existsSync, readFileSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

const templateMap: Record<string, string> = {
	'Акт приема-передачи': 'akt.pdf',
	'Выписка из домовой книги': 'domkniga.pdf',
	'Выписка из ЕГРН': 'egrn.pdf',
	'Договор купли-продажи': 'kyplya.pdf',
	'Выписка из финансово-лицевого счёта': 'licevoy.pdf',
	'Справка из ПНД': 'pnd.pdf',
	'Договор о передачи собственности': 'sobstv.pdf',
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params
	let type = decodeURIComponent(
		request.nextUrl.searchParams.get('type') || ''
	).trim()

	try {
		let filePath: string

		if (templateMap[type]) {
			filePath = join(process.cwd(), 'public', 'templates', templateMap[type])
		} else {
			filePath = join(process.cwd(), 'public', 'uploads', id, `${type}.pdf`)
		}

		if (!existsSync(filePath)) {
			return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
		}

		const fileBuffer = readFileSync(filePath)

		return new NextResponse(fileBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(
					`${type}.pdf`
				)}`,
			},
		})
	} catch (error) {
		console.error('Ошибка при скачивании файла:', error)
		return NextResponse.json(
			{ error: 'Ошибка при скачивании файла' },
			{ status: 500 }
		)
	}
}
