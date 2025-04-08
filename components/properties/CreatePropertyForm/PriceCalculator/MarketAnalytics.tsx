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
import { useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	PointElement,
	LineElement
)

interface Property {
	district: string
	price: number
	area: number
	created_at: string
}

export function MarketAnalytics({
	district,
	pricePerM2,
}: {
	district: string
	pricePerM2: number
}) {
	const { data, isLoading } = useQuery<Property[]>({
		queryKey: ['market-analytics'],
		queryFn: async () => {
			const res = await fetch('/api/properties')
			if (!res.ok) throw new Error('Ошибка загрузки')
			return res.json()
		},
	})

	const [comparison, setComparison] = useState<
		{ district: string; avg: number }[]
	>([])
	const [history, setHistory] = useState<
		{ month: string; avg_price: number }[]
	>([])

	useEffect(() => {
		if (!data) return

		const normalize = (str: string) => str.trim().toLowerCase()

		// ─── Сравнение ─────────────────────────────
		const groups: Record<string, number[]> = {}
		data.forEach(p => {
			if (!p.area || !p.price) return
			const pricePerM = p.price / p.area
			const key = p.district.trim()
			if (!groups[key]) groups[key] = []
			groups[key].push(pricePerM)
		})

		const result = Object.entries(groups).map(([district, prices]) => ({
			district,
			avg: prices.reduce((a, b) => a + b, 0) / prices.length,
		}))

		setComparison(result)

		// ─── Динамика ──────────────────────────────
		const filtered = data.filter(
			p => normalize(p.district) === normalize(district)
		)

		console.log('🎯 Выбран район:', district)
		console.log('📦 Найдено объектов:', filtered.length)

		const groupedByMonth: Record<string, number[]> = {}
		filtered.forEach(p => {
			if (!p.created_at || !p.area || !p.price) return
			const date = new Date(p.created_at)
			const month = `${date.getFullYear()}-${String(
				date.getMonth() + 1
			).padStart(2, '0')}`
			const pricePerM2 = p.price / p.area
			if (!groupedByMonth[month]) groupedByMonth[month] = []
			groupedByMonth[month].push(pricePerM2)
		})

		const historyData = Object.entries(groupedByMonth).map(
			([month, prices]) => ({
				month,
				avg_price: prices.reduce((a, b) => a + b, 0) / prices.length,
			})
		)

		console.log('📊 История цен:', historyData)

		setHistory(historyData.sort((a, b) => a.month.localeCompare(b.month)))
	}, [data, district])

	if (isLoading) return <div>Загрузка аналитики...</div>

	return (
		<div className='border rounded-lg p-4'>
			<Tabs defaultValue='comparison'>
				<TabsList className=' w-full grid-cols-2'>
					<TabsTrigger value='comparison'>Сравнение</TabsTrigger>
				</TabsList>

				{/* ─────────── СРАВНЕНИЕ ─────────── */}
				<TabsContent value='comparison' className='pt-4'>
					<div className='text-sm mb-2'>
						Средняя цена в <b>{district}</b>:{' '}
						{Math.round(pricePerM2 * 0.95).toLocaleString()} –{' '}
						{Math.round(pricePerM2 * 1.15).toLocaleString()} ₽/м²
					</div>

					{comparison.length === 0 ? (
						<div className='text-muted-foreground'>
							Нет данных для сравнения
						</div>
					) : (
						<Bar
							data={{
								labels: comparison.map(d => d.district),
								datasets: [
									{
										label: 'Средняя цена м²',
										data: comparison.map(d => Math.round(d.avg)),
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
										text: 'Сравнение по районам',
									},
								},
							}}
						/>
					)}
				</TabsContent>

				{/* ─────────── ДИНАМИКА ─────────── */}
				<TabsContent value='dynamics' className='pt-4'>
					{history.length === 0 ? (
						<div className='text-muted-foreground'>
							Нет данных по динамике для района <b>{district}</b>
						</div>
					) : (
						<Line
							data={{
								labels: history.map(p => p.month),
								datasets: [
									{
										label: 'Средняя цена м²',
										data: history.map(p => Math.round(p.avg_price)),
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
										text: `Динамика цен — ${district}`,
									},
								},
								scales: {
									y: {
										beginAtZero: false,
										ticks: {
											callback: (value: number) =>
												value.toLocaleString() + ' ₽',
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
