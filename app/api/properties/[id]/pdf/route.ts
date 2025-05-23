import { pool } from '@/lib/database'
import * as fontkit from 'fontkit'
import { readFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'
import { PDFDocument } from 'pdf-lib'

export async function GET(
	request: NextRequest,
	context: { params: { id: string } }
) {
	const { id } = context.params

	const result = await pool.query(`SELECT * FROM properties WHERE id = $1`, [
		Number(id),
	])
	const property = result.rows[0]

	if (!property) {
		return NextResponse.json({ error: 'Объект не найден' }, { status: 404 })
	}

	const pdfDoc = await PDFDocument.create()
	pdfDoc.registerFontkit(fontkit)

	const fontBytes = await readFile(
		join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf')
	)

	const font = await pdfDoc.embedFont(fontBytes)
	const page = pdfDoc.addPage([595, 842])
	const { width, height } = page.getSize()
	let y = height - 50

	const drawText = (label: string, value: string) => {
		page.drawText(`${label}: ${value}`, {
			x: 50,
			y,
			size: 12,
			font,
		})
		y -= 20
	}

	drawText('Адрес', property.address)
	drawText('Район', property.district)
	drawText('Цена', property.price + ' ₽')
	drawText('Площадь', property.area + ' м²')
	drawText('Состояние', property.condition || 'не указано')
	drawText('Тип дома', property.building_type || 'не указано')
	drawText('Этаж', `${property.floor} / ${property.total_floors || '—'}`)
	drawText('Ремонт', property.condition || 'не указано')
	drawText('Балкон', property.balcony_type || 'не указано')
	drawText('Парковка', property.parking_type || 'не указано')
	drawText('Год постройки', property.year_built || 'не указан')
	drawText('Цель', property.purpose === 'rent' ? 'Аренда' : 'Продажа')

	if (property.description) {
		drawText('Описание', property.description)
	}

	const pdfBytes = await pdfDoc.save()

	return new NextResponse(Buffer.from(pdfBytes), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="property_${id}.pdf"`,
		},
	})
}
