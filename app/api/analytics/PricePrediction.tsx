// components/analytics/PricePrediction.tsx

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

async function fetchPredictionData() {
	const res = await fetch('/api/predict')
	if (!res.ok) {
		throw new Error('Ошибка при загрузке данных для прогнозирования')
	}
	return res.json()
}

export function PricePrediction() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['predictionData'],
		queryFn: fetchPredictionData,
	})

	if (isLoading) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка при загрузке данных для прогнозирования</div>

	const { predictionData } = data
	const labels = predictionData.map((item: { month: string }) => item.month)
	const prices = predictionData.map(
		(item: { avg_price: number }) => item.avg_price
	)

	const chartData = {
		labels: labels,
		datasets: [
			{
				label: 'Средняя цена',
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
				text: 'Прогноз изменения цен',
			},
		},
	}

	return <Line options={options} data={chartData} />
}
