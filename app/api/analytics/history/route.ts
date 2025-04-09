import { pool } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url)
	const district = searchParams.get('district')

	if (!district) {
		return NextResponse.json({ error: 'No district provided' }, { status: 400 })
	}

	try {
		const result = await pool.query(
			`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        ROUND(AVG(price / NULLIF(area, 0))) AS avg_price
      FROM properties
      WHERE district = $1 AND area > 0 AND price > 0
      GROUP BY month
      ORDER BY month ASC
    `,
			[district]
		)

		return NextResponse.json(result.rows)
	} catch (err) {
		console.error('[history] error:', err)
		return NextResponse.json(
			{ error: 'Failed to fetch history' },
			{ status: 500 }
		)
	}
}
