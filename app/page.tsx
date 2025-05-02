'use client'

import { AdvancedPredictionForm } from '@/components/analytics/AdvancedPredictionForm'
import { PriceChart } from '@/components/analytics/PriceChart'
import { LogoutButton } from '@/components/LogoutButton'
import { PropertyModal } from '@/components/properties/PropertyModal'
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
import { Property } from '@/types/property'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	BarChart,
	Building2,
	CheckCircle,
	Loader2,
	Plus,
	Search,
	XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import {
	Bar,
	CartesianGrid,
	BarChart as RechartsBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

async function fetchProperties() {
	const res = await fetch('/api/properties')
	if (!res.ok) throw new Error('Ошибка при загрузке объектов')
	return res.json()
}

async function updatePropertyStatus({
	id,
	status,
}: {
	id: string
	status: string
}) {
	const res = await fetch(`/api/properties/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status }),
	})
	if (!res.ok) {
		const error = await res.json()
		throw new Error(error.message || 'Ошибка обновления статуса')
	}
	return res.json()
}

const RealtorsAnalytics = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['analytics-realtors'],
		queryFn: async () => {
			const res = await fetch('/api/analytics/realtors')

			if (!res.ok) {
				const errorData = await res.json()
				throw new Error(errorData.error || 'Ошибка загрузки данных')
			}

			return res.json()
		},
	})

	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-8'>
				<Loader2 className='h-8 w-8 animate-spin' />
			</div>
		)
	}

	if (error) {
		return (
			<div className='p-4 text-red-500'>
				Ошибка: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
			</div>
		)
	}

	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
			<div className='rounded-lg border bg-white p-4 shadow-sm'>
				<h2 className='mb-4 text-lg font-semibold'>Статистика по риэлторам</h2>
				<div className='space-y-4'>
					<div className='grid grid-cols-3 border-b pb-2 font-medium'>
						<div>Риэлтор</div>
						<div>Продажи</div>
						<div>Сумма</div>
					</div>
					{data.map((agent: any) => (
						<div
							key={agent.agent}
							className='grid grid-cols-3 border-b pb-2 last:border-b-0'
						>
							<div className='truncate'>{agent.agent}</div>
							<div>{agent.salesCount}</div>
							<div>
								{new Intl.NumberFormat('ru-RU', {
									style: 'currency',
									currency: 'RUB',
									maximumFractionDigits: 0,
								}).format(agent.totalSales)}
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='rounded-lg border bg-white p-4 shadow-sm'>
				<h2 className='mb-4 text-lg font-semibold'>График продаж</h2>
				<div className='h-64'>
					<ResponsiveContainer width='100%' height='100%'>
						<RechartsBarChart data={data}>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis
								dataKey='agent'
								angle={-45}
								tick={{ fontSize: 12 }}
								height={70}
							/>
							<YAxis />
							<Tooltip
								formatter={(value: number) => [
									new Intl.NumberFormat('ru-RU').format(value),
									'Количество продаж',
								]}
							/>
							<Bar
								dataKey='salesCount'
								name='Продажи'
								fill='#3b82f6'
								radius={[4, 4, 0, 0]}
							/>
						</RechartsBarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	)
}

export default function Home() {
	const queryClient = useQueryClient()
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedProperty, setSelectedProperty] = useState<Property | null>(
		null
	)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const {
		data: properties,
		isLoading: isLoadingProperties,
		isError: isPropertiesError,
	} = useQuery({
		queryKey: ['properties'],
		queryFn: fetchProperties,
		staleTime: 1000 * 60 * 5,
	})

	const mutation = useMutation({
		mutationFn: updatePropertyStatus,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['properties'] })
			queryClient.invalidateQueries({ queryKey: ['analytics-realtors'] })
		},
	})

	const openModal = (property: Property) => {
		setSelectedProperty(property)
		setIsModalOpen(true)
	}

	const filteredProperties = properties?.filter((property: Property) => {
		const searchLower = searchQuery.toLowerCase()
		return (
			property.address?.toLowerCase().includes(searchLower) ||
			property.district?.toLowerCase().includes(searchLower)
		)
	})

	const activeProperties = filteredProperties?.filter(
		(p: Property) => p.status === 'в продаже'
	)
	const archivedProperties = filteredProperties?.filter(
		(p: Property) => p.status !== 'в продаже'
	)

	return (
		<div className='flex min-h-screen w-full flex-col'>
			<header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
				<div className='flex items-center gap-2'>
					<Building2 className='h-6 w-6' />
					<span className='text-lg font-semibold'>Недвижимость Москвы</span>
				</div>
				<div className='ml-auto flex items-center gap-4'>
					<form className='relative' onSubmit={e => e.preventDefault()}>
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
					<LogoutButton />
				</div>
			</header>

			<main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				<Tabs defaultValue='properties'>
					<TabsList className='grid w-full grid-cols-3'>
						<TabsTrigger value='properties'>Объекты</TabsTrigger>
						<TabsTrigger value='analytics'>Аналитика</TabsTrigger>
						<TabsTrigger value='ai-predictions'>Прогноз</TabsTrigger>
					</TabsList>

					<TabsContent value='properties' className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle>Объекты в работе</CardTitle>
							</CardHeader>
							<CardContent className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
								{activeProperties?.map((property: Property) => (
									<Card
										key={property.id}
										className='cursor-pointer border bg-green-50'
										onClick={() => openModal(property)}
									>
										<CardHeader>
											<CardTitle className='flex items-center gap-2'>
												<CheckCircle className='h-5 w-5 text-green-600' />
												{property.address}
											</CardTitle>
											<CardDescription>{property.district}</CardDescription>
										</CardHeader>
										<CardContent className='space-y-1'>
											<p>Цена: {property.price?.toLocaleString('ru-RU')} ₽</p>
											<p>Площадь: {property.area} м²</p>
											<Button
												variant='destructive'
												size='sm'
												className='mt-2'
												onClick={e => {
													e.stopPropagation()
													mutation.mutate({
														id: property.id,
														status: 'не указано',
													})
												}}
											>
												Убрать из работы
											</Button>
										</CardContent>
									</Card>
								))}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Архив объектов</CardTitle>
							</CardHeader>
							<CardContent className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
								{archivedProperties?.map((property: Property) => (
									<Card
										key={property.id}
										className='cursor-pointer border bg-gray-50'
										onClick={() => openModal(property)}
									>
										<CardHeader>
											<CardTitle className='flex items-center gap-2'>
												<XCircle className='h-5 w-5 text-gray-400' />
												{property.address}
											</CardTitle>
											<CardDescription>{property.district}</CardDescription>
										</CardHeader>
										<CardContent className='space-y-1'>
											<p>Цена: {property.price?.toLocaleString('ru-RU')} ₽</p>
											<p>Площадь: {property.area} м²</p>
											<Button
												variant='outline'
												size='sm'
												className='mt-2'
												onClick={e => {
													e.stopPropagation()
													mutation.mutate({
														id: property.id,
														status: 'в продаже',
													})
												}}
											>
												Взять в работу
											</Button>
										</CardContent>
									</Card>
								))}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='analytics' className='space-y-6'>
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<BarChart className='h-5 w-5' />
									Аналитика риэлторов
								</CardTitle>
							</CardHeader>
							<CardContent>
								<RealtorsAnalytics />
							</CardContent>
						</Card>{' '}
						{/* Added closing Card tag */}
						<Card>
							<CardHeader>
								<CardTitle>Динамика цен</CardTitle>
							</CardHeader>
							<CardContent className='h-96'>
								<PriceChart />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='ai-predictions'>
						<Card>
							<CardHeader>
								<CardTitle>Прогноз стоимости</CardTitle>
								<CardDescription>
									Прогнозирование цен с учетом рыночных тенденций
								</CardDescription>
							</CardHeader>
							<CardContent>
								<AdvancedPredictionForm />
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>

				<PropertyModal
					property={selectedProperty}
					open={isModalOpen}
					onOpenChange={setIsModalOpen}
				/>
			</main>
		</div>
	)
}
