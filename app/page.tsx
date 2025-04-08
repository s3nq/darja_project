'use client'

import { useQuery } from '@tanstack/react-query'
import { Building2, LineChart, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { DistrictAnalytics } from '@/components/analytics/DistrictAnalytics'
import { PriceChart } from '@/components/analytics/PriceChart'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// ─────────────────────────────────────────────────────────────────────────────
// 1. Функции для запросов
// ─────────────────────────────────────────────────────────────────────────────
async function fetchProperties() {
	const res = await fetch('/api/properties')
	if (!res.ok) {
		throw new Error('Ошибка при загрузке объектов')
	}
	return res.json()
}

async function fetchPredictions() {
	const res = await fetch('/api/predict')
	if (!res.ok) {
		throw new Error('Ошибка при загрузке прогноза цен')
	}
	return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Главная страница
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
	// Список объектов
	const {
		data: propertiesData,
		isLoading: loadingProperties,
		isError: errorProperties,
	} = useQuery({
		queryKey: ['properties'],
		queryFn: fetchProperties,
	})

	// Прогноз цен
	const {
		data: predictionsData,
		isLoading: loadingPredictions,
		isError: errorPredictions,
	} = useQuery({
		queryKey: ['predictions'],
		queryFn: fetchPredictions,
	})

	// Если у тебя будет поиск, можешь управлять состоянием здесь
	const [searchQuery, setSearchQuery] = useState('')

	return (
		<div className='flex min-h-screen w-full flex-col'>
			{/* Шапка */}
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
				<div className='flex items-center gap-2'>
					<Building2 className='h-6 w-6' />
					<span className='text-lg font-semibold'>Недвижимость Москвы</span>
				</div>
				<div className='ml-auto flex items-center gap-4'>
					{/* Поиск */}
					<form onSubmit={e => e.preventDefault()} className='relative'>
						<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							type='search'
							placeholder='Поиск объектов...'
							className='w-72 rounded-lg bg-background pl-8'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
						/>
					</form>

					<Button asChild>
						<Link href='/properties/add'>
							<Plus className='mr-2 h-4 w-4' />
							Добавить объект
						</Link>
					</Button>
				</div>
			</header>

			{/* Основная часть */}
			<main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				{/* Карточки с быстр. статистикой */}
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					{/* Всего объектов */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Всего объектов
							</CardTitle>
							<Building2 className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							{loadingProperties ? (
								<div>Загрузка...</div>
							) : errorProperties ? (
								<div>Ошибка загрузки</div>
							) : (
								<>
									<div className='text-2xl font-bold'>
										{propertiesData.length}
									</div>
									<p className='text-xs text-muted-foreground'>
										Объектов в базе
									</p>
								</>
							)}
						</CardContent>
					</Card>

					{/* Активных объявлений (пример) */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Активных объявлений
							</CardTitle>
							<Building2 className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>324</div>
							<p className='text-xs text-muted-foreground'>
								+12 за последний месяц
							</p>
						</CardContent>
					</Card>

					{/* Средняя цена/м² (пример) */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Средняя цена/м²
							</CardTitle>
							<LineChart className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>185 000 ₽</div>
							<p className='text-xs text-muted-foreground'>
								+2.5% за последний месяц
							</p>
						</CardContent>
					</Card>

					{/* Продаж в этом месяце (пример) */}
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Продаж в этом месяце
							</CardTitle>
							<LineChart className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>42</div>
							<p className='text-xs text-muted-foreground'>
								+8% по сравнению с прошлым месяцем
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Вкладки */}
				<Tabs defaultValue='properties'>
					<TabsList>
						<TabsTrigger value='properties'>Объекты</TabsTrigger>
						<TabsTrigger value='analytics'>Аналитика рынка</TabsTrigger>
						<TabsTrigger value='predictions'>Прогноз цен</TabsTrigger>
					</TabsList>

					{/* Вкладка: объекты */}
					<TabsContent value='properties' className='space-y-4'>
						<Card>
							<CardHeader>
								<CardTitle>Список объектов</CardTitle>
								<CardDescription>
									Актуальные предложения недвижимости
								</CardDescription>
							</CardHeader>
							<CardContent>
								{loadingProperties ? (
									<div>Загрузка...</div>
								) : errorProperties ? (
									<div>Ошибка при загрузке объектов.</div>
								) : propertiesData.length === 0 ? (
									<div>Объекты не найдены.</div>
								) : (
									<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
										{propertiesData
											.filter((property: any) => {
												// примитивный поиск: по адресу / району
												if (!searchQuery) return true
												const lowerQuery = searchQuery.toLowerCase()
												return (
													property.address
														?.toLowerCase()
														.includes(lowerQuery) ||
													property.district?.toLowerCase().includes(lowerQuery)
												)
											})
											.map((property: any, index: number) => (
												<Card key={index} className='border shadow-sm'>
													<CardHeader>
														<CardTitle>
															{property.title || `Объект #${property.id}`}
														</CardTitle>
														<CardDescription>
															{property.address}
														</CardDescription>
													</CardHeader>
													<CardContent>
														<p>Цена: {property.price} ₽</p>
														<p>Площадь: {property.area} м²</p>
														<p>Район: {property.district}</p>
													</CardContent>
												</Card>
											))}
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					{/* Вкладка: аналитика рынка */}
					<TabsContent value='analytics' className='space-y-4'>
						<div className=' gap-4 md:grid-cols-2 lg:grid-cols-3'>
							<Card className='col-span-2'>
								<CardHeader>
									<CardTitle>Динамика цен</CardTitle>
									<CardDescription>
										Средняя цена за квадратный метр по районам
									</CardDescription>
								</CardHeader>
								<CardContent className='pl-2'>
									<PriceChart />
								</CardContent>
							</Card>

							<Card>
								<CardContent>
									<DistrictAnalytics />
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					{/* Вкладка: прогноз цен */}
					<TabsContent value='predictions' className='space-y-4'>
						<Card>
							<CardHeader>
								<CardTitle>Прогноз цен</CardTitle>
								<CardDescription>
									Прогнозируемое изменение цен на ближайшие 6 месяцев
								</CardDescription>
							</CardHeader>
							<CardContent>
								{loadingPredictions ? (
									<div>Загрузка...</div>
								) : errorPredictions ? (
									<div>Ошибка при загрузке данных.</div>
								) : !predictionsData || predictionsData.length === 0 ? (
									<div>Нет данных по прогнозам</div>
								) : (
									<div className='rounded-lg border'>
										<div className='flex flex-col'>
											{predictionsData.map((prediction: any) => (
												<div
													key={prediction.district}
													className='flex items-center justify-between border-b px-4 py-3 '
													style={{ display: 'flex', alignItems: 'center' }}
												>
													<div style={{ flex: 6 }}>{prediction.district}</div>
													<div style={{ flex: 6 }}>
														{prediction.current_price} ₽
													</div>
													<div
														className={
															prediction.change > 0
																? 'text-green-600'
																: 'text-red-600'
														}
														style={{ flex: 1 }}
													>
														{prediction.change}%
													</div>
												</div>
											))}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</div>
	)
}
