'use client'

import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Tooltip,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Legend, Tooltip)

export function AdvancedPredictionForm() {
	const [district, setDistrict] = useState('')
	const [sort, setSort] = useState<'asc' | 'desc'>('asc')
	const [predictions, setPredictions] = useState<any[]>([])

	useEffect(() => {
		const query = new URLSearchParams()
		if (district) query.set('district', district)
		if (sort) query.set('sort', sort)

		fetch(`/api/predict/advanced?${query.toString()}`)
			.then(res => res.json())
			.then(data => setPredictions(data))
	}, [district, sort])

	const labels = predictions.map(p => p.district.slice(0, 25) + '…')
	const currentPrices = predictions.map(p => Math.round(p.current_price))
	const predictedPrices = predictions.map(p => Math.round(p.predicted_price))

	return (
		<div className='space-y-6'>
			<div className='flex gap-4'>
				<select
					value={district}
					onChange={e => setDistrict(e.target.value)}
					className='border px-2 py-1'
				>
					<option value=''>Все районы</option>
					<option value='САО'>САО</option>
					<option value='ЮЗАО'>ЮЗАО</option>
					<option value='ЗАО'>ЗАО</option>
					<option value='ЦАО'>ЦАО</option>
					<option value='Таганский'>Таганский</option>
					<option value='Арбат'>Арбат</option>
					<option value='ВАО'>ВАО</option>
					<option value='ЮАО'>ЮАО</option>
				</select>

				<select
					value={sort}
					onChange={e => setSort(e.target.value as 'asc' | 'desc')}
					className='border px-2 py-1'
				>
					<option value='asc'>По росту</option>
					<option value='desc'>По снижению</option>
				</select>
			</div>

			{/* ГРАФИК */}
			{predictions.length > 0 && (
				<Bar
					data={{
						labels,
						datasets: [
							{
								label: 'Текущая цена',
								data: currentPrices,
								backgroundColor: 'rgba(75, 192, 192, 0.5)',
							},
							{
								label: 'Прогноз ',
								data: predictedPrices,
								backgroundColor: 'rgba(255, 99, 132, 0.5)',
							},
						],
					}}
					options={{
						responsive: true,
						plugins: {
							legend: { position: 'top' },
							tooltip: {
								callbacks: {
									label: ctx =>
										`${ctx.dataset.label}: ${ctx.raw.toLocaleString()} ₽`,
								},
							},
						},
						scales: {
							y: {
								beginAtZero: false,
								ticks: {
									callback: (v: number) => `${v.toLocaleString()} ₽`,
								},
							},
						},
					}}
				/>
			)}

			{/* ТАБЛИЦА */}
			<table className='w-full text-sm'>
				<tbody>
					{predictions.map((item, i) => (
						<tr key={i} className='border-t'>
							<td>{item.district}</td>
							<td className='text-right'>
								{Math.round(item.predicted_price).toLocaleString()} ₽
							</td>
							<td
								className={`text-right ${
									item.diff > 0 ? 'text-green-500' : 'text-red-500'
								}`}
							>
								{item.diff.toFixed(2)}%
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
