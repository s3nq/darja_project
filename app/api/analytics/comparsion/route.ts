// app/api/analytics/comparison/route.ts
import { pool } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const result = await pool.query(`
      SELECT district, ROUND(AVG(price / NULLIF(area, 0))) AS avg_price
      FROM properties
      GROUP BY district
      ORDER BY avg_price DESC
    `)

		return NextResponse.json(result.rows)
	} catch (err) {
		console.error('[comparison] error:', err)
		return NextResponse.json(
			{ error: 'Failed to fetch comparison' },
			{ status: 500 }
		)
	}
}
