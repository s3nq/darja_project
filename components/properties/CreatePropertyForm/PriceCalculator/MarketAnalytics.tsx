'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from 'chart.js'
import { useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
)

interface MarketAnalyticsProps {
	district: string
	pricePerM2: number
	purpose?: 'buy' | 'rent'
}

export function MarketAnalytics({
	district: initialDistrict,
	pricePerM2,
	purpose = 'buy',
}: MarketAnalyticsProps) {
	const [district, setDistrict] = useState(initialDistrict)

	const { data: comparisonData } = useQuery({
		queryKey: ['district-comparison', purpose],
		queryFn: async () => {
			const res = await fetch(`/api/analytics/comparison?purpose=${purpose}`)
			if (!res.ok) throw new Error('Ошибка сравнения')
			return res.json() as Promise<{ district: string; avg_price: number }[]>
		},
	})

	const { data: historyData } = useQuery({
		queryKey: ['district-history', district, purpose],
		queryFn: async () => {
			const res = await fetch(
				`/api/analytics/history?district=${district}&purpose=${purpose}`
			)
			if (!res.ok) throw new Error('Ошибка истории')
			return res.json() as Promise<{ month: string; avg_price: number }[]>
		},
		enabled: !!district,
	})

	return (
		<div className='border rounded-lg p-4'>
			<Tabs defaultValue='comparison'>
				<TabsList className='w-full grid grid-cols-2 mb-4'>
					<TabsTrigger value='comparison'>Сравнение районов</TabsTrigger>
					<TabsTrigger value='history'>Динамика по району</TabsTrigger>
				</TabsList>

				{/* СРАВНЕНИЕ */}
				<TabsContent value='comparison'>
					{comparisonData && (
						<Bar
							data={{
								labels: comparisonData.map(d => d.district),
								datasets: [
									{
										label:
											purpose === 'rent'
												? 'Средняя аренда м²'
												: 'Средняя цена м²',
										data: comparisonData.map(d => d.avg_price),
										backgroundColor: 'rgba(59, 130, 246, 0.5)',
										borderRadius: 4,
									},
								],
							}}
							options={{
								responsive: true,
								plugins: {
									legend: { display: false },
									title: {
										display: true,
										text:
											purpose === 'rent'
												? 'Сравнение аренды по районам'
												: 'Сравнение цен по районам',
									},
								},
								scales: {
									y: {
										beginAtZero: false,
										ticks: {
											callback: v => `${Number(v).toLocaleString()} ₽`,
										},
									},
								},
							}}
						/>
					)}
				</TabsContent>

				{/* ДИНАМИКА */}
				<TabsContent value='history'>
					<div className='mb-4'>
						<label className='text-sm text-muted-foreground'>
							Выберите район:
						</label>
						<select
							className='border px-2 py-1 ml-2'
							value={district}
							onChange={e => setDistrict(e.target.value)}
						>
							<option>ЦАО</option>
							<option>САО</option>
							<option>ЮЗАО</option>
							<option>ЗАО</option>
							<option>ВАО</option>
							<option>ЮАО</option>
						</select>
					</div>

					{historyData && historyData.length > 0 && (
						<Line
							data={{
								labels: historyData.map(p => p.month),
								datasets: [
									{
										label: purpose === 'rent' ? 'Аренда м²' : 'Цена м²',
										data: historyData.map(p => p.avg_price),
										borderColor: 'rgb(59, 130, 246)',
										backgroundColor: 'rgba(59, 130, 246, 0.5)',
										tension: 0.4,
									},
								],
							}}
							options={{
								responsive: true,
								plugins: {
									legend: { display: false },
									title: {
										display: true,
										text: `${
											purpose === 'rent' ? 'Аренда' : 'Цены'
										} — ${district}`,
									},
								},
								scales: {
									y: {
										ticks: {
											callback: v => `${Number(v).toLocaleString()} ₽`,
										},
									},
								},
							}}
						/>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
