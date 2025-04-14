'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, CheckCircle, Plus, Search, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

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

// Запрос объектов
async function fetchProperties() {
	const res = await fetch('/api/properties')
	if (!res.ok) throw new Error('Ошибка при загрузке объектов')
	return res.json()
}

// Обновление статуса
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
	if (!res.ok) throw new Error('Ошибка обновления статуса')
	return res.json()
}

export default function Home() {
	const queryClient = useQueryClient()
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedProperty, setSelectedProperty] = useState<Property | null>(
		null
	)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const openModal = (property: Property) => {
		setSelectedProperty(property)
		setIsModalOpen(true)
	}

	const {
		data: properties,
		isLoading,
		isError,
	} = useQuery({ queryKey: ['properties'], queryFn: fetchProperties })

	const mutation = useMutation({
		mutationFn: updatePropertyStatus,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['properties'] })
		},
	})

	const filtered = properties?.filter((p: Property) => {
		if (!searchQuery) return true
		const q = searchQuery.toLowerCase()
		return (
			p.address?.toLowerCase().includes(q) ||
			p.district?.toLowerCase().includes(q)
		)
	})

	const inProgress = filtered?.filter((p: Property) => p.status === 'в продаже')
	const notInProgress = filtered?.filter(
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
					<LogoutButton />
				</div>
			</header>

			<main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
				<Tabs defaultValue='properties'>
					<TabsList>
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
								{inProgress?.map((property: Property) => (
									<Card
										key={property.id}
										className='bg-green-50 border cursor-pointer'
										onClick={() => openModal(property)}
									>
										<CardHeader>
											<CardTitle className='flex items-center gap-2'>
												<CheckCircle className='text-green-600 w-5 h-5' />
												{property.address}
											</CardTitle>
											<CardDescription>{property.district}</CardDescription>
										</CardHeader>
										<CardContent className='space-y-1'>
											<p>Цена: {property.price} ₽</p>
											<p>Площадь: {property.area} м²</p>
											<Button
												variant='destructive'
												size='sm'
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
								{notInProgress?.map((property: Property) => (
									<Card
										key={property.id}
										className='bg-gray-50 border cursor-pointer'
										onClick={() => openModal(property)}
									>
										<CardHeader>
											<CardTitle className='flex items-center gap-2'>
												<XCircle className='text-gray-400 w-5 h-5' />
												{property.address}
											</CardTitle>
											<CardDescription>{property.district}</CardDescription>
										</CardHeader>
										<CardContent className='space-y-1'>
											<p>Цена: {property.price} ₽</p>
											<p>Площадь: {property.area} м²</p>
											<Button
												variant='outline'
												size='sm'
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

					<TabsContent value='analytics'>
						<Card className='col-span-2'>
							<CardHeader>
								<CardTitle>Динамика цен</CardTitle>
							</CardHeader>
							<CardContent>
								<PriceChart />
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='ai-predictions'>
						<Card>
							<CardHeader>
								<CardTitle>Прогноз на основе трендов</CardTitle>
								<CardDescription>
									Прогноз стоимости с учётом динамики района и корректировкой
									модели
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
