import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
})

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { status } = await request.json()

		const propertyId = parseInt(params.id)
		if (isNaN(propertyId)) {
			return NextResponse.json(
				{ error: 'Неверный ID объекта' },
				{ status: 400 }
			)
		}

		const result = await pool.query(
			`UPDATE properties 
       SET status = $1 
       WHERE id = $2 
       RETURNING id, status, address`,
			[status, propertyId]
		)

		if (result.rowCount === 0) {
			return NextResponse.json({ error: 'Объект не найден' }, { status: 404 })
		}

		return NextResponse.json({
			success: true,
			data: result.rows[0],
		})
	} catch (error) {
		console.error('Ошибка обновления:', error)
		return NextResponse.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
