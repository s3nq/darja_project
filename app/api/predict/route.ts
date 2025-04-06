// app/api/predict/route.tsx
import { pool } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const client = await pool.connect()

		const result = await client.query(`
			SELECT 
				district, 
				current_price, 
				predicted_price,
				ROUND(((predicted_price - current_price) / current_price) * 100, 2) AS change
			FROM price_predictions
		`)

		client.release()

		return NextResponse.json(result.rows)
	} catch (error) {
		console.error('Ошибка при получении прогноза цен:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
	}
}
