import { pool } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const id = parseInt(params.id)
		const { status } = await req.json()

		const result = await pool.query(
			'UPDATE properties SET status = $1 WHERE id = $2 RETURNING *',
			[status, id]
		)

		return NextResponse.json(result.rows[0])
	} catch (error) {
		console.error('Ошибка при обновлении статуса:', error)
		return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 })
	}
}
