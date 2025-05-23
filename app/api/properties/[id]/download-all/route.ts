import { existsSync, readdirSync, readFileSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { PDFDocument } from 'pdf-lib'
export const runtime = 'nodejs'

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params

	const templateDir = join(process.cwd(), 'public', 'templates')
	const uploadsDir = join(process.cwd(), 'public', 'uploads', id)

	const allDocs = [
		'akt.pdf',
		'domkniga.pdf',
		'egrn.pdf',
		'kyplya.pdf',
		'licevoy.pdf',
		'pnd.pdf',
		'sobstv.pdf',
	]

	const mergedPdf = await PDFDocument.create()

	// Добавляем шаблонные документы
	for (const fileName of allDocs) {
		const filePath = join(templateDir, fileName)
		if (existsSync(filePath)) {
			const fileBuffer = readFileSync(filePath)
			const pdf = await PDFDocument.load(fileBuffer)
			const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
			copiedPages.forEach(page => mergedPdf.addPage(page))
		}
	}

	// Добавляем загруженные пользователем документы
	if (existsSync(uploadsDir)) {
		const uploadedFiles = readdirSync(uploadsDir).filter(f =>
			f.endsWith('.pdf')
		)
		for (const fileName of uploadedFiles) {
			const filePath = join(uploadsDir, fileName)
			if (existsSync(filePath)) {
				const fileBuffer = readFileSync(filePath)
				const pdf = await PDFDocument.load(fileBuffer)
				const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
				copiedPages.forEach(page => mergedPdf.addPage(page))
			}
		}
	}

	const mergedPdfBytes = await mergedPdf.save()

	return new NextResponse(Buffer.from(mergedPdfBytes), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="all_documents.pdf"`,
		},
	})
}
