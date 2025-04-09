import { pool } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	try {
		// 1. Получаем все районы
		const districtsRes = await pool.query(`
			SELECT DISTINCT district FROM properties
		`)
		const districts = districtsRes.rows.map(r => r.district)

		// 2. Анализ по каждому району
		const results: any[] = []

		for (const district of districts) {
			// Средняя текущая цена
			const currentRes = await pool.query(
				`
        SELECT ROUND(AVG(price)) AS current_price
        FROM properties
        WHERE district = $1 AND area > 0 AND price > 0
        `,
				[district]
			)
			const current_price = Number(currentRes.rows[0]?.current_price ?? 0)
			if (!current_price) continue

			// История (тренд)
			const historyRes = await pool.query(
				`
        SELECT 
          TO_CHAR(created_at, 'YYYY-MM') AS month,
          ROUND(AVG(price / NULLIF(area, 0))) AS avg_price
        FROM properties
        WHERE district = $1
        GROUP BY month
        ORDER BY month DESC
        LIMIT 3
        `,
				[district]
			)

			const hist = historyRes.rows
			let trend = 0

			if (hist.length >= 2) {
				const recent = hist[0].avg_price
				const past = hist[hist.length - 1].avg_price
				trend = (recent - past) / past
			}

			// Прогноз
			const predicted_price = Math.round(current_price * (1 + trend))
			const diff = ((predicted_price - current_price) / current_price) * 100

			results.push({
				district,
				current_price,
				predicted_price,
				diff,
			})
		}

		// Фильтрация и сортировка
		const { searchParams } = new URL(req.url)
		const sort = searchParams.get('sort') === 'desc' ? 'desc' : 'asc'
		const districtFilter = searchParams.get('district')

		const filtered = districtFilter
			? results.filter(p => p.district === districtFilter)
			: results

		const sorted = filtered.sort((a, b) =>
			sort === 'asc' ? a.diff - b.diff : b.diff - a.diff
		)

		return NextResponse.json(sorted)
	} catch (err) {
		console.error('[predict/advanced] error:', err)
		return NextResponse.json(
			{ error: 'Failed to fetch district prediction' },
			{ status: 500 }
		)
	}
}
