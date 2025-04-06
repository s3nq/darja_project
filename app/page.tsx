// app/page.tsx
'use client'

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
import axios from 'axios'
import { Building2, LineChart, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const fetchProperties = async () => {
	const response = await axios.get('/api/properties')
	return response.data
}

const fetchPricePredictions = async () => {
	const response = await axios.get('/api/predict') 
	return response.data
}

export default function Home() {
	const [predictions, setPredictions] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isError, setIsError] = useState(false)

	const [properties, setProperties] = useState<any[]>([])
	const [loadingProperties, setLoadingProperties] = useState(true)
	const [errorProperties, setErrorProperties] = useState(false)

	useEffect(() => {
		const getPredictions = async () => {
			try {
				const data = await fetchPricePredictions()
				setPredictions(data)
			} catch {
				setIsError(true)
			} finally {
				setIsLoading(false)
			}
		}

		const getProperties = async () => {
			try {
				const data = await fetchProperties()
				setProperties(data)
			} catch {
				setErrorProperties(true)
			} finally {
				setLoadingProperties(false)
			}
		}

		getPredictions()
		getProperties()
	}, [])

	return (
		<div className='flex min-h-screen w-full flex-col'>
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
				<div className='flex items-center gap-2'>
					<Building2 className='h-6 w-6' />
					<span className='text-lg font-semibold'>Недвижимость Москвы</span>
				</div>
				<div className='ml-auto flex items-center gap-4'>
					<form className='relative'>
						<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							type='search'
							placeholder='Поиск объектов...'
							className='w-72 rounded-lg bg-background pl-8'
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

			<main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
					<Card>
						<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
							<CardTitle className='text-sm font-medium'>
								Всего объектов
							</CardTitle>
							<Building2 className='h-4 w-4 text-muted-foreground' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{properties.length}</div>
							<p className='text-xs text-muted-foreground'>Объектов в базе</p>
						</CardContent>
					</Card>

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

				<Tabs defaultValue='properties'>
					<TabsList>
						<TabsTrigger value='properties'>Объекты</TabsTrigger>
						<TabsTrigger value='analytics'>Аналитика рынка</TabsTrigger>
						<TabsTrigger value='predictions'>Прогноз цен</TabsTrigger>
					</TabsList>

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
								) : properties.length === 0 ? (
									<div>Объекты не найдены.</div>
								) : (
									<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
										{properties.map((property, index) => (
											<Card key={index} className='border shadow-sm'>
												<CardHeader>
													<CardTitle>{property.title || 'Объект'}</CardTitle>
													<CardDescription>{property.address}</CardDescription>
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

					<TabsContent value='analytics' className='space-y-4'>
						<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
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
								<CardHeader>
									<CardTitle>Анализ по районам</CardTitle>
									<CardDescription>Спрос по районам</CardDescription>
								</CardHeader>
								<CardContent>
									<DistrictAnalytics />
								</CardContent>
							</Card>
						</div>
					</TabsContent>

					<TabsContent value='predictions' className='space-y-4'>
						<Card>
							<CardHeader>
								<CardTitle>Прогноз цен</CardTitle>
								<CardDescription>
									Прогнозируемое изменение цен на ближайшие 6 месяцев
								</CardDescription>
							</CardHeader>
							<CardContent>
								{isLoading ? (
									<div>Загрузка...</div>
								) : isError ? (
									<div>Ошибка при загрузке данных.</div>
								) : (
									<div className='rounded-lg border'>
										<div className='flex flex-col'>
											{predictions.map(prediction => (
												<div
													key={prediction.district}
													className='flex items-center justify-between border-b px-4 py-3'
												>
													<div>{prediction.district}</div>
													<div>{prediction.currentPrice} ₽</div>
													<div
														className={
															prediction.change > 0
																? 'text-green-600'
																: 'text-red-600'
														}
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
