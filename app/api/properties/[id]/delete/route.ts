import { existsSync, unlinkSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

export async function DELETE(
	req: NextRequest,
	context: { params: { id: string } }
) {
	try {
		const id = context.params.id
		const { searchParams } = new URL(req.url)
		const file = searchParams.get('file')

		if (!file) {
			return NextResponse.json({ error: 'Файл не указан' }, { status: 400 })
		}

		const filePath = join(process.cwd(), 'public', 'uploads', id, file)

		if (!existsSync(filePath)) {
			return NextResponse.json({ error: 'Файл не найден' }, { status: 404 })
		}

		unlinkSync(filePath)

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Ошибка при удалении файла:', error)
		return NextResponse.json(
			{ error: 'Ошибка при удалении файла' },
			{ status: 500 }
		)
	}
}
