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

// Функция для получения данных о ценах с API
async function fetchPriceData() {
	const res = await fetch('/api/analytics')
	if (!res.ok) {
		throw new Error('Ошибка при загрузке данных')
	}
	return res.json()
}

export function PriceChart() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['priceData'],
		queryFn: fetchPriceData,
	})

	if (isLoading) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка при загрузке данных</div>

	const { labels, data: priceData } = data

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: 'Динамика цен на квадратный метр',
			},
		},
		scales: {
			y: {
				beginAtZero: true,
				ticks: {
					callback: function (value: number) {
						return value.toLocaleString() + ' ₽'
					},
				},
			},
		},
	}

	const chartData = {
		labels: labels,
		datasets: [
			{
				label: 'Средняя цена м²',
				data: priceData,
				borderColor: 'rgb(59, 130, 246)',
				backgroundColor: 'rgba(59, 130, 246, 0.5)',
			},
		],
	}

	return <Line options={options} data={chartData} />
}
