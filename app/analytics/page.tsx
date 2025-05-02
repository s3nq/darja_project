// app/analytics/page.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart, Loader2 } from 'lucide-react'
import {
	Bar,
	CartesianGrid,
	BarChart as RechartsBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

const fetchAnalytics = async () => {
	const res = await fetch('/api/analytics')
	if (!res.ok) throw new Error('Ошибка загрузки')
	return res.json()
}

export default function AnalyticsPage() {
	const { data, isLoading, error } = useQuery({
		queryKey: ['analytics'],
		queryFn: fetchAnalytics,
	})

	if (isLoading)
		return (
			<div className='flex justify-center p-8'>
				<Loader2 className='animate-spin' />
			</div>
		)

	if (error)
		return <div className='p-4 text-red-500'>Ошибка: {error.message}</div>

	return (
		<div className='p-6 max-w-6xl mx-auto'>
			<h1 className='text-2xl font-bold mb-8 flex gap-2 items-center'>
				<BarChart className='w-6 h-6' /> Аналитика продаж
			</h1>

			<div className='grid md:grid-cols-2 gap-6'>
				{/* Таблица */}
				<div className='border rounded-lg p-4 bg-white shadow-sm'>
					<h2 className='text-lg font-semibold mb-4'>Детальная статистика</h2>
					<div className='space-y-4'>
						<div className='grid grid-cols-3 font-medium border-b pb-2'>
							<div>Риэлтор</div>
							<div>Продажи</div>
							<div>Сумма</div>
						</div>
						{data.map((item: any) => (
							<div key={item.agent} className='grid grid-cols-3 border-b pb-2'>
								<div>{item.agent}</div>
								<div>{item.salesCount}</div>
								<div>
									{new Intl.NumberFormat('ru-RU').format(item.totalSales)} ₽
								</div>
							</div>
						))}
					</div>
				</div>

				{/* График */}
				<div className='border rounded-lg p-4 bg-white shadow-sm'>
					<h2 className='text-lg font-semibold mb-4'>Визуализация продаж</h2>
					<div className='h-64'>
						<ResponsiveContainer width='100%' height='100%'>
							<RechartsBarChart data={data}>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis
									dataKey='agent'
									angle={-45}
									textAnchor='end'
									interval={0}
									height={70}
								/>
								<YAxis />
								<Tooltip
									formatter={(value: number) => [
										value.toLocaleString('ru-RU'),
										value === 0 ? 'Продажи' : 'Сумма',
									]}
								/>
								<Bar
									dataKey='salesCount'
									name='Количество продаж'
									fill='#3b82f6'
								/>
								<Bar dataKey='totalSales' name='Общая сумма' fill='#10b981' />
							</RechartsBarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</div>
	)
}
