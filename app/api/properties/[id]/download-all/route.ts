import { readdirSync, readFileSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { PDFDocument } from 'pdf-lib'

export async function GET(
	_req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id

	try {
		const uploadsDir = join(process.cwd(), 'public', 'templates') // путь изменён на templates
		const files = readdirSync(uploadsDir).filter(file => file.endsWith('.pdf'))

		if (files.length === 0) {
			return NextResponse.json({ error: 'Файлы не найдены' }, { status: 404 })
		}

		const pdfDoc = await PDFDocument.create()

		for (const filename of files) {
			const filePath = join(uploadsDir, filename)
			const fileBytes = readFileSync(filePath)
			const donorPdf = await PDFDocument.load(fileBytes)
			const copiedPages = await pdfDoc.copyPages(
				donorPdf,
				donorPdf.getPageIndices()
			)
			copiedPages.forEach(page => pdfDoc.addPage(page))
		}

		const mergedPdfBytes = await pdfDoc.save()

		return new NextResponse(Buffer.from(mergedPdfBytes), {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="Все документы по объекту №${id}.pdf"`,
			},
		})
	} catch (error) {
		console.error('Ошибка при создании PDF:', error)
		return NextResponse.json(
			{ error: 'Ошибка при создании PDF' },
			{ status: 500 }
		)
	}
}
