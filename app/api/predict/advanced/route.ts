import { pool } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

// Глубокая вероятностная модель прогнозирования цен
export async function GET(req: NextRequest) {
	try {
		//  Получаем районы
		const districtsRes = await pool.query(
			`SELECT DISTINCT district FROM properties`
		)
		const districts = districtsRes.rows.map(r => r.district)

		const results: any[] = []

		for (const district of districts) {
			//  Получение исторических цен по месяцам
			const historyRes = await pool.query(
				`
				SELECT 
					TO_CHAR(created_at, 'YYYY-MM') AS month,
					ROUND(AVG(price / NULLIF(area, 0))) AS avg_price
				FROM properties
				WHERE district = $1
				GROUP BY month
				ORDER BY month ASC
				LIMIT 12
			`,
				[district]
			)

			const hist = historyRes.rows
			if (hist.length < 3) continue // Мало данных — скипаем

			const prices = hist.map(h => Number(h.avg_price)).filter(Boolean)
			const lnPrices = prices.map(p => Math.log(p))
			const t = Array.from({ length: lnPrices.length }, (_, i) => i + 1)

			//  Логарифмическая регрессия (находим α и β)
			const n = lnPrices.length
			const sumT = t.reduce((a, b) => a + b, 0)
			const sumLnP = lnPrices.reduce((a, b) => a + b, 0)
			const sumT2 = t.reduce((a, b) => a + b * b, 0)
			const sumTLnP = t.reduce((sum, ti, i) => sum + ti * lnPrices[i], 0)

			const beta = (n * sumTLnP - sumT * sumLnP) / (n * sumT2 - sumT * sumT)
			const alpha = (sumLnP - beta * sumT) / n

			//  Прогноз на следующий месяц
			const tNext = n + 1
			const predicted_ln_price = alpha + beta * tNext
			const predicted_price = Math.exp(predicted_ln_price)

			//  Оценка отклонений и доверительного интервала
			const residuals = lnPrices.map((lnP, i) => lnP - (alpha + beta * t[i]))
			const variance = residuals.reduce((sum, r) => sum + r * r, 0) / (n - 2)
			const std_error = Math.sqrt(variance)

			// Уровень доверия 68% (можно заменить на 95% → * 1.96)
			const epsilon = Math.exp(predicted_ln_price + std_error) - predicted_price

			//  Средняя текущая цена (по всей выборке)
			const currentRes = await pool.query(
				`
				SELECT ROUND(AVG(price / NULLIF(area, 0))) AS current_price
				FROM properties
				WHERE district = $1 AND area > 0 AND price > 0
			`,
				[district]
			)

			const current_price = Number(currentRes.rows[0]?.current_price ?? 0)

			//  Индекс надёжности (низкая дисперсия = высокая уверенность)
			const uncertainty_index = 1 - Math.min(std_error, 1) // чем меньше, тем лучше

			const diff = ((predicted_price - current_price) / current_price) * 100

			results.push({
				district,
				current_price: Math.round(current_price),
				predicted_price: Math.round(predicted_price),
				confidence_interval: `±${Math.round(epsilon)} ₽`,
				diff: Number(diff.toFixed(2)),
				reliability: Math.round(uncertainty_index * 100) + '%',
			})
		}

		//  Фильтрация и сортировка
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
			{ error: 'Failed to fetch prediction' },
			{ status: 500 }
		)
	}
}
