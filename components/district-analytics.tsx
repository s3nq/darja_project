'use client'

import {
	Bar,
	BarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

// Моковые данные - в реальном приложении будут загружаться из API
const data = [
	{
		district: 'Центральный',
		inquiries: 120,
		viewings: 85,
		offers: 42,
	},
	{
		district: 'Северный',
		inquiries: 98,
		viewings: 65,
		offers: 31,
	},
	{
		district: 'Южный',
		inquiries: 86,
		viewings: 56,
		offers: 24,
	},
	{
		district: 'Восточный',
		inquiries: 72,
		viewings: 48,
		offers: 18,
	},
	{
		district: 'Западный',
		inquiries: 105,
		viewings: 72,
		offers: 36,
	},
]

export function DistrictAnalytics() {
	return (
		<ResponsiveContainer width='100%' height={350}>
			<BarChart data={data}>
				<XAxis
					dataKey='district'
					stroke='#888888'
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke='#888888'
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<Tooltip />
				<Bar
					dataKey='inquiries'
					fill='#8884d8'
					radius={[4, 4, 0, 0]}
					name='Запросы'
				/>
				<Bar
					dataKey='viewings'
					fill='#82ca9d'
					radius={[4, 4, 0, 0]}
					name='Просмотры'
				/>
				<Bar
					dataKey='offers'
					fill='#ffc658'
					radius={[4, 4, 0, 0]}
					name='Предложения'
				/>
			</BarChart>
		</ResponsiveContainer>
	)
}
