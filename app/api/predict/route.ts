// app/api/predict/route.ts
import { pool } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const district = searchParams.get('district')
	const sort = searchParams.get('sort') === 'desc' ? 'DESC' : 'ASC'

	const whereClause = district ? `WHERE district = '${district}'` : ''

	const query = `
		SELECT 
			address, 
			price AS current_price,
			price * (1 + (RANDOM() - 0.5) * 0.3) AS predicted_price,
			((price * (1 + (RANDOM() - 0.5) * 0.3) - price) / price) AS diff
		FROM properties
		${whereClause}
		ORDER BY diff ${sort}
	`

	try {
		const result = await pool.query(query)
		return NextResponse.json(result.rows)
	} catch (err) {
		console.error('Ошибка предсказания цен:', err)
		return NextResponse.json(
			{ error: 'Ошибка получения предсказаний' },
			{ status: 500 }
		)
	}
}
