import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id

	const formData = await req.formData()
	const file = formData.get('file') as File
	const type = formData.get('type') as string

	if (!file || !type || !file.name.endsWith('.pdf')) {
		return NextResponse.json(
			{ error: 'Некорректный файл или тип документа' },
			{ status: 400 }
		)
	}

	try {
		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		const uploadDir = join(process.cwd(), 'public', 'uploads', id)

		if (!existsSync(uploadDir)) {
			mkdirSync(uploadDir, { recursive: true })
		}

		const filePath = join(uploadDir, `${type}.pdf`)
		writeFileSync(filePath, buffer)

		return NextResponse.json({ success: true, filename: `${type}.pdf` })
	} catch (err) {
		console.error('Ошибка загрузки файла:', err)
		return NextResponse.json(
			{ error: 'Ошибка загрузки файла' },
			{ status: 500 }
		)
	}
}
