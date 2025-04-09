//C:\Users\tawer\Desktop\darja_project\components\analytics\DistrictAnalytics.tsx
'use client'

import { useQuery } from '@tanstack/react-query'
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const fetchDistrictData = async () => {
	const res = await fetch('/api/analytics/districts')
	if (!res.ok) throw new Error('Ошибка при загрузке аналитики')
	return res.json()
}

export function DistrictAnalytics() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['districtAnalytics'],
		queryFn: fetchDistrictData,
	})

	if (isLoading) return <div>Загрузка...</div>
	if (isError) return <div>Ошибка при загрузке данных</div>

	const chartData = {
		labels: data.labels,
		datasets: [
			{
				label: 'Спрос (кол-во объектов)',
				data: data.data,
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
				text: 'Спрос по районам',
			},
		},
	}

	return <Bar options={options} data={chartData} />
}
