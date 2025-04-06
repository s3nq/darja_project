// components/analytics/MarketAnalytics.tsx

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'

async function fetchAnalyticsData() {
	const res = await fetch('/api/analytics')
	if (!res.ok) {
		throw new Error('Ошибка при загрузке данных аналитики')
	}
	return res.json()
}

export function MarketAnalytics() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['analyticsData'],
		queryFn: fetchAnalyticsData,
	})

	if (isLoading) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка при загрузке данных аналитики</div>

	return (
		<Card>
			<CardHeader>
				<CardTitle>Аналитика по районам</CardTitle>
				<CardDescription>Средняя цена за м² по районам</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{data.analyticsData.map(
						(item: { district: string; average_price_per_m2: number }) => (
							<div key={item.district} className='flex justify-between'>
								<div>{item.district}</div>
								<div>{item.average_price_per_m2.toLocaleString('ru-RU')} ₽</div>
							</div>
						)
					)}
				</div>
			</CardContent>
		</Card>
	)
}
