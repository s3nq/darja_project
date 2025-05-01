'use client'

import AddPropertyPage from '@/app/properties/add/page'
import { PropertyFormData } from '@/components/properties/CreatePropertyForm/types'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditPropertyWrapper() {
	const { id } = useParams()
	const router = useRouter()
	const [initialValues, setInitialValues] = useState<PropertyFormData | null>(
		null
	)

	function safeValue<T>(
		val: T | null | undefined,
		fallback: string = ''
	): string {
		return val !== null && val !== undefined ? String(val) : fallback
	}

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(`/api/properties/${id}`)
				if (!res.ok) throw new Error('Ошибка загрузки данных')

				const data = await res.json()
				console.log('🔥 RAW DATA FROM API:', data)

				const transformedData: PropertyFormData = {
					address: safeValue(data.address),
					district: safeValue(data.district),
					area: safeValue(data.area),
					price: safeValue(data.price),
					floor: safeValue(data.floor),
					totalFloors: safeValue(data.total_floors),
					yearBuilt: safeValue(
						data.year_built,
						new Date().getFullYear().toString()
					),
					metroDistance: safeValue(data.metro_distance, '10'),
					elevatorCount: safeValue(data.elevator_count, '1'),
					kitchenArea: safeValue(data.kitchen_area),
					description: safeValue(data.description),
					condition: safeValue(data.condition, 'Новый'),
					purpose: data.purpose || 'buy',
					renovation: safeValue(data.renovation, 'Косметический ремонт'),
					rooms: safeValue(data.rooms, '1'),
					balconyType: safeValue(data.balcony_type, 'Нет'),
					buildingType: safeValue(data.building_type, 'Панельный'),
					hasFreightElevator: data.has_freight_elevator ?? false,
					ceilingHeight: safeValue(data.ceiling_height, '2.7'),
					parkingType: safeValue(data.parking_type, 'Нет'),
					agents: Array.isArray(data.agents) ? data.agents : [],
					owners: Array.isArray(data.owners)
						? data.owners.map((o: any) => ({
								name: safeValue(o.name),
								phone: safeValue(o.phone),
								email: safeValue(o.email),
						  }))
						: [],
				}

				setInitialValues(transformedData)
				console.log('📦 Transformed to form data:', transformedData)
			} catch (error) {
				console.error('Fetch error:', error)
				router.push('/')
			}
		}

		fetchData()
	}, [id, router])

	if (!initialValues) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900'></div>
			</div>
		)
	}

	return (
		<AddPropertyPage
			initialValues={initialValues}
			propertyId={id as string}
			isEditMode
		/>
	)
}
