'use client'

import { useQuery } from '@tanstack/react-query'
import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

export function PriceChart() {
	const { data } = useQuery({
		queryKey: ['priceData'],
		queryFn: async () => {
			const res = await fetch('/api/analytics/comparison')
			if (!res.ok) throw new Error('Ошибка при загрузке данных')
			return res.json()
		},
	})

	if (!Array.isArray(data)) return null

	const chartData = {
		labels: data.map((d: any) => d.district),
		datasets: [
			{
				label: 'Средняя цена м²',
				data: data.map((d: any) => d.avg_price),
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.5)',
				tension: 0.3,
			},
		],
	}

	const options = {
		responsive: true,
		plugins: {
			legend: { position: 'top' as const },
			title: {
				display: true,
				text: 'Сравнение средней цены по районам',
			},
		},
		scales: {
			y: {
				beginAtZero: false,
				ticks: {
					callback: (value: number) => value.toLocaleString() + ' ₽',
				},
			},
		},
	}

	return <Line options={options} data={chartData} />
}
