import { existsSync, readFileSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const type = searchParams.get('type')

	if (!type) {
		return NextResponse.json({ error: 'Тип не указан' }, { status: 400 })
	}

	const filenameMap: Record<string, string> = {
		'Акт приема-передачи.': 'akt.pdf',
		'Выписка из домовой книги': 'domkniga.pdf',
		'Выписка из ЕГРН': 'egrn.pdf',
		'Договор купли-продажи': 'kyplya.pdf',
		'Выписка из финансово-лицевого счёта': 'licevoy.pdf',
		'Справка из ПНД': 'pnd.pdf',
		'Договор о передачи собственности': 'sobstv.pdf',
	}

	const fileName = filenameMap[type]
	if (!fileName) {
		return NextResponse.json(
			{ error: 'Неизвестный тип документа' },
			{ status: 400 }
		)
	}

	const filePath = join(process.cwd(), 'public', 'templates', fileName)
	if (!existsSync(filePath)) {
		return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
	}

	const buffer = readFileSync(filePath)
	return new NextResponse(buffer, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${fileName}"`,
		},
	})
}
