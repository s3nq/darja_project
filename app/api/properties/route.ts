// app/api/properties/route.tsx
import { pool } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const result = await pool.query('SELECT * FROM properties')
		return NextResponse.json(result.rows)
	} catch (error) {
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		)
	}
}
