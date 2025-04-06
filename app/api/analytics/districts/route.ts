import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	password: 'real_estate123', 
	database: 'real_estate', 
})

export async function GET() {
	try {
		const result = await pool.query(`
			SELECT district, COUNT(*) AS demand
			FROM properties
			WHERE district IS NOT NULL
			GROUP BY district
			ORDER BY demand DESC
			LIMIT 10;
		`)

		const labels = result.rows.map((row: any) => row.district)
		const data = result.rows.map((row: any) => parseInt(row.demand, 10))

		return NextResponse.json({ labels, data })
	} catch (error) {
		console.error('Ошибка при получении аналитики по районам:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
