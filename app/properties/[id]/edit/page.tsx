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

	useEffect(() => {
		const fetchData = async () => {
			const res = await fetch(`/api/properties/${id}`)
			if (!res.ok) {
				router.push('/')
				return
			}
			const data = await res.json()
			setInitialValues({
				address: data.address || '',
				district: data.district || '',
				area: data.area?.toString() || '',
				price: data.price?.toString() || '',
				floor: data.floor?.toString() || '',
				totalFloors: data.totalFloors ? data.totalFloors.toString() : '',
				yearBuilt: data.yearBuilt?.toString() || '',
				metroDistance: data.metroDistance?.toString() || '',
				elevatorCount: data.elevatorCount?.toString() || '',
				kitchenArea: data.kitchenArea?.toString() || '',
				description: data.description || '',
				condition: data.condition || 'не указано',
				purpose: data.purpose || 'buy',
				renovation: data.renovation || '',
				rooms: data.rooms || '',
				balconyType: data.balconyType || '',
				buildingType: data.buildingType || '',
				hasFreightElevator: data.hasFreightElevator || false,
				ceilingHeight: data.ceilingHeight?.toString() || '',
				parkingType: data.parkingType || '',
			})
		}
		fetchData()
	}, [id])

	if (!initialValues) return <div className='p-4'>Загрузка...</div>

	return (
		<AddPropertyPage
			initialValues={initialValues}
			propertyId={id as string}
			isEditMode
		/>
	)
}
