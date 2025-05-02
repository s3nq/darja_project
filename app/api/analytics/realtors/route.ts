import { pool } from '@/lib/database' // Убедитесь, что путь правильный
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const { rows } = await pool.query(`
      SELECT 
        agent AS "agent",
        COUNT(*) FILTER (WHERE status = 'sold')::int AS "salesCount",
        COALESCE(SUM(price) FILTER (WHERE status = 'sold'), 0)::int AS "totalSales"
      FROM properties, jsonb_array_elements_text(agents) AS agent
      GROUP BY agent
      ORDER BY "salesCount" DESC
    `)

		return NextResponse.json(rows)
	} catch (error) {
		console.error('Database error:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 }
		)
	}
}
