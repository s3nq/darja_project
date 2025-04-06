'use client'

import { GeneralParamsForm } from '@/components/properties/CreatePropertyForm/FormSections/GeneralParamsForm'
import { PrimaryFactorsForm } from '@/components/properties/CreatePropertyForm/FormSections/PrimaryFactorsForm'
import { SecondaryFactorsForm } from '@/components/properties/CreatePropertyForm/FormSections/SecondaryFactorsForm'
import { CalculatorCard } from '@/components/properties/CreatePropertyForm/PriceCalculator/CalculatorCard'
import { MarketAnalytics } from '@/components/properties/CreatePropertyForm/PriceCalculator/MarketAnalytics'
import {
	PriceDetails,
	PriceDetailsType,
} from '@/components/properties/CreatePropertyForm/PriceCalculator/PriceDetails'
import { PropertyFormData } from '@/components/properties/CreatePropertyForm/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function AddPropertyPage() {
	const router = useRouter()
	const [formData, setFormData] = useState<PropertyFormData>({
		district: '',
		address: '',
		metroDistance: '10',
		rooms: '1',
		renovation: 'Косметический ремонт',
		kitchenArea: '',
		balconyType: 'Нет',
		buildingType: 'Панельный',
		elevatorCount: '1',
		hasFreightElevator: false,
		ceilingHeight: '2.7',
		parkingType: 'Нет',
		area: '',
		floor: '',
		totalFloors: '',
		yearBuilt: new Date().getFullYear().toString(),
		description: '',
	})

	const [priceDetails, setPriceDetails] = useState<PriceDetailsType | null>(
		null
	)
	const [calculationSuccess, setCalculationSuccess] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Обработчики изменений
	const handleValueChange = (name: keyof PropertyFormData, value: string) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSwitchChange = (
		name: keyof PropertyFormData,
		checked: boolean
	) => {
		setFormData(prev => ({ ...prev, [name]: checked }))
	}

	const handleSliderChange = (
		name: keyof PropertyFormData,
		value: number[]
	) => {
		setFormData(prev => ({ ...prev, [name]: value[0].toString() }))
	}

	// Функции расчета коэффициентов
	const calculateMetroCoefficient = (minutes: number): number => {
		const normalizedMinutes = Math.min(Math.max(minutes, 1), 30)
		return 1.0 - (normalizedMinutes / 5) * 0.02
	}

	const calculateDistrictCoefficient = (district: string): number => {
		return (
			{
				'Центральный район': 1.15,
				'Северный район': 1.05,
				'Южный район': 0.98,
				'Восточный район': 0.95,
				'Западный район': 1.0,
			}[district] || 1.0
		)
	}

	const calculateRoomsCoefficient = (rooms: number): number => {
		const normalizedRooms = Math.min(Math.max(rooms, 0), 5)
		return 1.0 - normalizedRooms * 0.03
	}

	const calculateRenovationCoefficient = (renovation: string): number => {
		return (
			{
				'Без отделки': 0.85,
				'Требует ремонта': 0.95,
				'Косметический ремонт': 1.0,
				Евроремонт: 1.1,
				'Дизайнерский ремонт': 1.2,
			}[renovation] || 1.0
		)
	}

	const calculatePrice = async () => {
		if (!formData.area || !formData.district) {
			toast.error('Заполните площадь и район для расчета цены')
			return
		}

		try {
			const metroCoefficient = calculateMetroCoefficient(
				Number(formData.metroDistance)
			)
			const districtCoefficient = calculateDistrictCoefficient(
				formData.district
			)
			const roomsCoefficient = calculateRoomsCoefficient(Number(formData.rooms))
			const renovationCoefficient = calculateRenovationCoefficient(
				formData.renovation
			)

			const basePrice = 250000
			const totalArea = Number(formData.area) || 50
			const pricePerSquareMeter =
				basePrice * districtCoefficient * metroCoefficient

			const mockDetails: PriceDetailsType = {
				basePrice,
				totalArea,
				pricePerSquareMeter,
				districtCoefficient,
				metroCoefficient,
				roomsCoefficient,
				renovationCoefficient,
				kitchenCoefficient: 0.98,
				balconyCoefficient: 1.02,
				primaryFactorsCoefficient: 1.12,
				buildingTypeCoefficient: 1.05,
				elevatorCoefficient: 1.03,
				ceilingHeightCoefficient: 1.01,
				parkingCoefficient: 1.05,
				secondaryFactorsCoefficient: 1.07,
			}

			setPriceDetails(mockDetails)
			setCalculationSuccess(true)
			setTimeout(() => setCalculationSuccess(false), 3000)
		} catch (error) {
			toast.error('Ошибка при расчете цены')
			console.error('Calculation error:', error)
		}
	}

	const handleSubmit = async () => {
		if (!priceDetails || !formData.area || !formData.district) {
			toast.error('Заполните обязательные поля и рассчитайте цену')
			return
		}

		try {
			setIsSubmitting(true)

			const response = await fetch('/api/properties', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					price: priceDetails.basePrice * priceDetails.totalArea,
					area: parseFloat(formData.area),
					floor: parseInt(formData.floor),
					totalFloors: parseInt(formData.totalFloors),
					yearBuilt: parseInt(formData.yearBuilt),
					metroDistance: parseInt(formData.metroDistance),
					elevatorCount: parseInt(formData.elevatorCount),
					kitchenArea: parseFloat(formData.kitchenArea),
				}),
			})

			if (!response.ok) throw new Error('Ошибка сохранения')

			const result = await response.json()
			toast.success('Объект успешно добавлен!')
			router.push(`/properties/${result.id}`)
		} catch (error) {
			toast.error('Ошибка при сохранении объекта')
			console.error('Submission error:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className='container mx-auto py-6'>
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='icon' asChild>
						<Link href='/'>
							<ArrowLeft className='h-4 w-4' />
						</Link>
					</Button>
					<h1 className='text-2xl font-bold'>Добавить новый объект</h1>
				</div>
			</div>

			<div className='grid gap-6 md:grid-cols-2'>
				<div className='space-y-6'>
					<PrimaryFactorsForm
						values={formData}
						onValueChange={handleValueChange}
						onSliderChange={handleSliderChange}
					/>

					<SecondaryFactorsForm
						values={formData}
						onValueChange={handleValueChange}
						onSwitchChange={handleSwitchChange}
					/>

					<GeneralParamsForm
						values={formData}
						onValueChange={handleValueChange}
					/>
				</div>

				<div className='space-y-6'>
					<CalculatorCard
						price={priceDetails?.basePrice * priceDetails?.totalArea || null}
						onCalculate={calculatePrice}
						calculationSuccess={calculationSuccess}
						isCalculating={isSubmitting}
					/>

					{priceDetails && (
						<>
							<PriceDetails details={priceDetails} />
							<MarketAnalytics
								district={formData.district}
								pricePerM2={priceDetails.pricePerSquareMeter}
							/>
						</>
					)}

					<div className='mt-4 p-4 border-t'>
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className='w-full'
						>
							{isSubmitting ? 'Сохранение...' : 'Добавить объект'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
