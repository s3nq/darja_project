// app/api/analytics/route.ts

import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
})

export async function GET() {
	try {
		const result = await pool.query(`
      SELECT district, ROUND(AVG(price / NULLIF(area, 0))) AS average_price_per_m2
      FROM properties
      WHERE area > 0
      GROUP BY district
      ORDER BY average_price_per_m2 DESC;
    `)

		const analyticsData = result.rows

		const labels = analyticsData.map(row => row.district)
		const data = analyticsData.map(row => Number(row.average_price_per_m2))

		return NextResponse.json({ labels, data })
	} catch (error) {
		console.error('Ошибка при извлечении данных для аналитики:', error)
		return NextResponse.json(
			{ error: 'Ошибка при извлечении данных для аналитики' },
			{ status: 500 }
		)
	}
}
