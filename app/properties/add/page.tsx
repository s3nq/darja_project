'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

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
		purpose: 'buy',
	})

	const [priceDetails, setPriceDetails] = useState<PriceDetailsType | null>(
		null
	)
	const [calculationSuccess, setCalculationSuccess] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

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

	const calculatePrice = async () => {
		if (!formData.area || !formData.district) {
			toast.error('Заполните хотя бы Общую площадь и Район!')
			return
		}

		try {
			const basePrice = 231000
			const area = parseFloat(formData.area) || 50

			const getCoef = (v: number) => v || 1

			const totalCoef =
				getDistrictCoefficient(formData.district) *
				getMetroCoefficient(parseInt(formData.metroDistance)) *
				getRoomsCoefficient(formData.rooms) *
				getRenovationCoefficient(formData.renovation) *
				getBuildingTypeCoefficient(formData.buildingType) *
				getElevatorCoefficient(
					parseInt(formData.elevatorCount),
					formData.hasFreightElevator
				) *
				getCeilingHeightCoefficient(parseFloat(formData.ceilingHeight)) *
				getBalconyCoefficient(formData.balconyType) *
				getParkingCoefficient(formData.parkingType) *
				getYearBuiltCoefficient(parseInt(formData.yearBuilt)) *
				getKitchenAreaCoefficient(parseFloat(formData.kitchenArea), area)

			const pricePerM2 = basePrice * totalCoef
			const finalPrice = pricePerM2 * area

			const rentMonth = finalPrice * 0.005 // 0.5% в месяц (пример)
			const rentDay = rentMonth / 30

			setPriceDetails({
				basePrice,
				totalArea: area,
				districtCoef: getDistrictCoefficient(formData.district),
				metroCoef: getMetroCoefficient(parseInt(formData.metroDistance)),
				roomsCoef: getRoomsCoefficient(formData.rooms),
				renovationCoef: getRenovationCoefficient(formData.renovation),
				buildingCoef: getBuildingTypeCoefficient(formData.buildingType),
				elevatorCoef: getElevatorCoefficient(
					parseInt(formData.elevatorCount),
					formData.hasFreightElevator
				),
				ceilingCoef: getCeilingHeightCoefficient(
					parseFloat(formData.ceilingHeight)
				),
				balconyCoef: getBalconyCoefficient(formData.balconyType),
				parkingCoef: getParkingCoefficient(formData.parkingType),
				yearBuiltCoef: getYearBuiltCoefficient(parseInt(formData.yearBuilt)),
				kitchenCoef: getKitchenAreaCoefficient(
					parseFloat(formData.kitchenArea),
					area
				),
				pricePerSquareMeter: pricePerM2,
				finalPrice,
				rentMonth,
				rentDay,
			})

			setCalculationSuccess(true)
			setTimeout(() => setCalculationSuccess(false), 2000)
		} catch (e) {
			toast.error('Ошибка расчёта')
		}
	}

	const handleSubmit = async () => {
		if (!priceDetails || !formData.area || !formData.district) {
			toast.error('Заполните все основные поля и сделайте расчет!')
			return
		}

		try {
			setIsSubmitting(true)

			const response = await fetch('/api/properties', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					area: parseFloat(formData.area),
					price:
						formData.purpose === 'rent'
							? priceDetails.rentMonth
							: priceDetails.finalPrice,
					floor: parseInt(formData.floor),
					totalFloors: parseInt(formData.totalFloors),
					yearBuilt: parseInt(formData.yearBuilt),
					metroDistance: parseInt(formData.metroDistance),
					elevatorCount: parseInt(formData.elevatorCount),
					kitchenArea: parseFloat(formData.kitchenArea),
				}),
			})

			if (!response.ok) throw new Error('Ошибка сохранения')

			toast.success('Объект добавлен!')
			router.push('/')
		} catch (error) {
			toast.error('Ошибка при сохранении объекта')
		} finally {
			setIsSubmitting(false)
		}
	}

	// ─────────────────────────────────────────────────────────────────────────────
	// Коэффициенты (оставим без изменений)
	// ─────────────────────────────────────────────────────────────────────────────
	function getDistrictCoefficient(d: string) {
		return d === 'Центральный район' ? 1.15 : 1
	}
	function getMetroCoefficient(d: number) {
		return 1 - Math.floor(d / 5) * 0.0029
	}
	function getRoomsCoefficient(r: string) {
		return r === '5+' ? 0.75 : 1 - parseInt(r) * 0.02
	}
	function getRenovationCoefficient(v: string) {
		return (
			{
				'Без отделки': 0.8,
				'Требует ремонта': 0.9,
				'Косметический ремонт': 1.0,
				Евроремонт: 1.1,
				'Дизайнерский ремонт': 1.2,
			}[v] ?? 1
		)
	}
	function getBuildingTypeCoefficient(t: string) {
		return (
			{
				Кирпичный: 1.05,
				Монолитный: 1.08,
				'Монолитно-кирпичный': 1.1,
				Панельный: 0.95,
				Блочный: 0.9,
				Деревянный: 0.8,
			}[t] ?? 1
		)
	}
	function getElevatorCoefficient(count: number, freight: boolean) {
		return 1 + (count - 1) * 0.02 + (freight ? 0.03 : 0)
	}
	function getCeilingHeightCoefficient(h: number) {
		return h >= 3 ? 1.05 : h < 2.5 ? 0.95 : 1
	}
	function getBalconyCoefficient(b: string) {
		return b === 'Нет' ? 0.97 : b === 'Несколько' ? 1.03 : 1
	}
	function getParkingCoefficient(p: string) {
		return { Нет: 0.95, Открытая: 1, Крытая: 1.03, Подземная: 1.05 }[p] ?? 1
	}
	function getYearBuiltCoefficient(y: number) {
		const age = new Date().getFullYear() - y
		return age > 50 ? 0.85 : age > 30 ? 0.92 : 1
	}
	function getKitchenAreaCoefficient(k: number, total: number) {
		return k < 6 ? 0.95 : k / total > 0.15 ? 1.03 : 1
	}

	// ─────────────────────────────────────────────────────────────────────────────
	// Рендер
	// ─────────────────────────────────────────────────────────────────────────────
	return (
		<div className='container mx-auto py-6'>
			<div className='mb-6 flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Button variant='outline' size='icon' asChild>
						<Link href='/'>
							<ArrowLeft className='h-4 w-4' />
						</Link>
					</Button>
					<h1 className='text-2xl font-bold'>Добавить новый объект</h1>
				</div>
			</div>

			{/* Переключатель Покупка / Аренда */}
			<div className='flex gap-4 mb-6'>
				<Button
					variant={formData.purpose === 'buy' ? 'default' : 'outline'}
					onClick={() => handleValueChange('purpose', 'buy')}
				>
					Покупка
				</Button>
				<Button
					variant={formData.purpose === 'rent' ? 'default' : 'outline'}
					onClick={() => handleValueChange('purpose', 'rent')}
				>
					Аренда
				</Button>
			</div>

			<div className='grid gap-6 md:grid-cols-2'>
				{/* Форма слева */}
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

				{/* Аналитика и расчёт справа */}
				<div className='space-y-6'>
					<CalculatorCard
						calculatedPrice={
							formData.purpose === 'rent'
								? priceDetails?.rentMonth
								: priceDetails?.finalPrice
						}
						calculationSuccess={calculationSuccess}
						onCalculate={calculatePrice}
						purpose={formData.purpose}
						dailyPrice={priceDetails?.rentDay}
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
