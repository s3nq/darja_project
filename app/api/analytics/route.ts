// app/api/analytics/route.tsx

import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
	connectionString: process.env.DATABASE_URL, // Подключение к вашей БД
})

export async function GET() {
	try {

		const result = await pool.query(`
      SELECT district, AVG(price / area) AS average_price_per_m2
      FROM properties
      GROUP BY district
      ORDER BY average_price_per_m2 DESC;
    `)

		const analyticsData = result.rows

		return NextResponse.json({ analyticsData })
	} catch (error) {
		console.error('Ошибка при извлечении данных для аналитики:', error)
		return NextResponse.json(
			{ error: 'Ошибка при извлечении данных для аналитики' },
			{ status: 500 }
		)
	}
}
