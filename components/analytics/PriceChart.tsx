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

async function fetchPriceData() {
	const res = await fetch('/api/analytics')
	if (!res.ok) throw new Error('Ошибка при загрузке данных')
	return res.json()
}

export function PriceChart() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['priceData'],
		queryFn: fetchPriceData,
	})

	if (isLoading) return <div>Загрузка графика...</div>
	if (isError) return <div>Ошибка при загрузке графика</div>

	const chartData = {
		labels: data.labels,
		datasets: [
			{
				label: 'Средняя цена м²',
				data: data.data,
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.5)',
			},
		],
	}

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Динамика цен',
			},
		},
		scales: {
			y: {
				beginAtZero: false,
				ticks: {
					callback: function (value: number) {
						return value.toLocaleString() + ' ₽'
					},
				},
			},
		},
	}

	return <Line options={options} data={chartData} />
}
