import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
})

export async function GET() {
	try {
		const result = await pool.query(`
      SELECT 
        agent AS "agent",
        COUNT(*) FILTER (WHERE status = 'sold') AS "salesCount",
        COALESCE(SUM(price) FILTER (WHERE status = 'sold'), 0) AS "totalSales"
      FROM properties, jsonb_array_elements_text(agents) AS agent
      GROUP BY agent
      ORDER BY "salesCount" DESC;
    `)

		const analyticsData = result.rows.map(row => ({
			agent: row.agent,
			salesCount: Number(row.salesCount),
			totalSales: Number(row.totalSales),
		}))

		return NextResponse.json(analyticsData)
	} catch (error) {
		console.error('Ошибка аналитики:', error)
		return NextResponse.json(
			{ error: 'Ошибка получения аналитики' },
			{ status: 500 }
		)
	}
}
