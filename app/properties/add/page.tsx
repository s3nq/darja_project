'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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
import { OwnerList } from '@/components/ui/OwnerList'
import { RealtorList } from '@/components/ui/RealtorList'
import { Button } from '@/components/ui/button'

export default function AddPropertyPage({
	initialValues,
	propertyId,
	isEditMode = false,
}: {
	initialValues?: PropertyFormData
	propertyId?: string
	isEditMode?: boolean
}) {
	const defaultFormData: PropertyFormData = {
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
		condition: 'Новый',
		price: '123',
		agents: [],
		owners: [],
	}

	const [formData, setFormData] = useState<PropertyFormData>(defaultFormData)
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		if (initialValues && !isInitialized) {
			console.log('✅ initialValues в AddPropertyPage:', initialValues)

			const normalized: PropertyFormData = {
				...defaultFormData,
				...initialValues,
				district: normalizeDistrict(initialValues.district),
				renovation: normalizeRenovation(initialValues.renovation),
				buildingType: normalizeBuildingType(initialValues.buildingType),
				balconyType: normalizeBalconyType(initialValues.balconyType),
				parkingType: normalizeParkingType(initialValues.parkingType),
				rooms: normalizeRooms(initialValues.rooms),
				elevatorCount: initialValues.elevatorCount?.toString() || '1',
				metroDistance: initialValues.metroDistance?.toString() || '10',
				ceilingHeight: initialValues.ceilingHeight?.toString() || '2.7',
				kitchenArea: initialValues.kitchenArea?.toString() || '',
				floor: initialValues.floor?.toString() || '',
				totalFloors: initialValues.totalFloors?.toString() || '',
				yearBuilt:
					initialValues.yearBuilt?.toString() ||
					new Date().getFullYear().toString(),
			}

			setFormData(normalized)
			setIsInitialized(true)
		}
	}, [initialValues, isInitialized])

	const normalizeDistrict = (v: string) => {
		const map: Record<string, string> = {
			ЦАО: 'ЦАО',
			САО: 'САО',
			ЮАО: 'ЮАО',
			ВАО: 'ВАО',
			ЗАО: 'ЗАО',
		}
		return map[v] || v
	}
	function shortDistrict(full: string): string {
		const map: Record<string, string> = {
			'Центральный район': 'ЦАО',
			'Северный район': 'САО',
			'Южный район': 'ЮАО',
			'Восточный район': 'ВАО',
			'Западный район': 'ЗАО',
			'Юго-Западный район': 'ЮЗАО',
			'Северо-Восточный район': 'СВАО',
			'Юго-Восточный район': 'ЮВАО',
			'Северо-Западный район': 'СЗАО',
		}
		return map[full] || full
	}

	const normalizeRenovation = (v: string) => {
		const map = {
			'Без отделки': 'Без отделки',
			'Требует ремонта': 'Требует ремонта',
			'Косметический ремонт': 'Косметический ремонт',
			Евроремонт: 'Евроремонт',
			'Дизайнерский ремонт': 'Дизайнерский ремонт',
		}
		return map[v as keyof typeof map] || ''
	}

	const normalizeBuildingType = (v: string) => {
		const map = {
			Кирпичный: 'Кирпичный',
			Монолитный: 'Монолитный',
			'Монолитно-кирпичный': 'Монолитно-кирпичный',
			Панельный: 'Панельный',
			Блочный: 'Блочный',
			Деревянный: 'Деревянный',
		}
		return map[v as keyof typeof map] || ''
	}

	const normalizeBalconyType = (v: string) => {
		const map = {
			Нет: 'Нет',
			Балкон: 'Балкон',
			Лоджия: 'Лоджия',
			Несколько: 'Несколько',
		}
		return map[v as keyof typeof map] || ''
	}

	const normalizeParkingType = (v: string) => {
		const map = {
			Нет: 'Нет',
			Открытая: 'Открытая',
			Крытая: 'Крытая',
			Подземная: 'Подземная',
		}
		return map[v as keyof typeof map] || ''
	}

	function normalizeRooms(v: string) {
		if (!v) return ''
		if (v === '5+' || v === '5 и более') return '5+'
		if (['0', '1', '2', '3', '4'].includes(v)) return v
		return v
	}

	const [priceDetails, setPriceDetails] = useState<PriceDetailsType | null>(
		null
	)

	const [calculationSuccess, setCalculationSuccess] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()
	const handleValueChange = (name: keyof PropertyFormData, value: string) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	{
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
				const isRent = formData.purpose === 'rent'

				const totalCoef = isRent
					? getDistrictCoefficient(formData.district, true) *
					  getMetroCoefficient(parseInt(formData.metroDistance), true) *
					  getRoomsCoefficient(formData.rooms, true) *
					  getRenovationCoefficient(formData.renovation, true) *
					  getBuildingTypeCoefficient(formData.buildingType, true) *
					  getElevatorCoefficient(
							parseInt(formData.elevatorCount),
							formData.hasFreightElevator,
							true
					  ) *
					  getCeilingHeightCoefficient(
							parseFloat(formData.ceilingHeight),
							true
					  ) *
					  getBalconyCoefficient(formData.balconyType, true) *
					  getParkingCoefficient(formData.parkingType, true) *
					  getYearBuiltCoefficient(parseInt(formData.yearBuilt), true) *
					  getKitchenAreaCoefficient(
							parseFloat(formData.kitchenArea),
							area,
							true
					  )
					: getDistrictCoefficient(formData.district) *
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
				const rentMonth = Math.round(finalPrice * 0.0045)
				const rentDay = Math.round(rentMonth / 30)

				setPriceDetails({
					basePrice,
					totalArea: area,
					districtCoef: getDistrictCoefficient(formData.district, isRent),
					metroCoef: getMetroCoefficient(
						parseInt(formData.metroDistance),
						isRent
					),
					roomsCoef: getRoomsCoefficient(formData.rooms, isRent),
					renovationCoef: getRenovationCoefficient(formData.renovation, isRent),
					buildingCoef: getBuildingTypeCoefficient(
						formData.buildingType,
						isRent
					),
					elevatorCoef: getElevatorCoefficient(
						parseInt(formData.elevatorCount),
						formData.hasFreightElevator,
						isRent
					),
					ceilingCoef: getCeilingHeightCoefficient(
						parseFloat(formData.ceilingHeight),
						isRent
					),
					balconyCoef: getBalconyCoefficient(formData.balconyType, isRent),
					parkingCoef: getParkingCoefficient(formData.parkingType, isRent),
					yearBuiltCoef: getYearBuiltCoefficient(
						parseInt(formData.yearBuilt),
						isRent
					),
					kitchenCoef: getKitchenAreaCoefficient(
						parseFloat(formData.kitchenArea),
						area,
						isRent
					),
					pricePerSquareMeter: pricePerM2,
					finalPrice,
					rentMonth,
					rentDay,
					purpose: formData.purpose,
				})

				setCalculationSuccess(true)
				setTimeout(() => setCalculationSuccess(false), 2000)
			} catch {
				toast.error('Ошибка расчёта')
			}
		}

		const handleSubmit = async () => {
			if (
				isNaN(parseFloat(formData.area)) ||
				isNaN(parseInt(formData.floor)) ||
				isNaN(parseInt(formData.totalFloors))
			) {
				toast.error('Проверьте числовые поля (Этаж, Всего этажей, Площадь)')
				return
			}

			try {
				setIsSubmitting(true)

				const response = await fetch(
					isEditMode ? `/api/properties/${propertyId}` : '/api/properties',
					{
						method: isEditMode ? 'PUT' : 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							...formData,
							district: shortDistrict(formData.district),
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
							agents: formData.agents || [],
							owners: formData.owners || [],
						}),
					}
				)

				if (!response.ok) throw new Error('Ошибка сохранения')

				toast.success(isEditMode ? 'Объект обновлен!' : 'Объект добавлен!')
				router.push('/')
			} catch (error) {
				toast.error('Ошибка при сохранении объекта')
			} finally {
				setIsSubmitting(false)
			}
		}

		function getDistrictCoefficient(d: string, isRent = false) {
			return d === 'Центральный район' ? (isRent ? 1.05 : 1.15) : 1
		}

		function getMetroCoefficient(d: number, isRent = false) {
			const base = 1 - Math.floor(d / 5) * 0.0029
			return isRent ? base - 0.01 : base
		}

		function getRoomsCoefficient(r: string, isRent = false) {
			const coef = r === '5+' ? 0.75 : 1 - parseInt(r) * 0.02
			return isRent ? coef * 1.02 : coef
		}

		function getRenovationCoefficient(v: string, isRent = false) {
			const map: Record<string, number> = {
				'Без отделки': isRent ? 0.85 : 0.8,
				'Требует ремонта': isRent ? 0.95 : 0.9,
				'Косметический ремонт': 1.0,
				Евроремонт: isRent ? 1.05 : 1.1,
				'Дизайнерский ремонт': isRent ? 1.1 : 1.2,
			}
			return map[v] ?? 1
		}

		function getBuildingTypeCoefficient(t: string, isRent = false) {
			const map: Record<string, number> = {
				Кирпичный: isRent ? 1.02 : 1.05,
				Монолитный: isRent ? 1.04 : 1.08,
				'Монолитно-кирпичный': isRent ? 1.06 : 1.1,
				Панельный: isRent ? 0.92 : 0.95,
				Блочный: 0.9,
				Деревянный: 0.8,
			}
			return map[t] ?? 1
		}

		function getElevatorCoefficient(
			count: number,
			freight: boolean,
			isRent = false
		) {
			const value = 1 + (count - 1) * 0.02 + (freight ? 0.03 : 0)
			return isRent ? value - 0.01 : value
		}

		function getCeilingHeightCoefficient(h: number, isRent = false) {
			if (h >= 3) return isRent ? 1.03 : 1.05
			if (h < 2.5) return isRent ? 0.96 : 0.95
			return 1
		}

		function getBalconyCoefficient(b: string, isRent = false) {
			if (b === 'Нет') return isRent ? 0.98 : 0.97
			if (b === 'Несколько') return isRent ? 1.02 : 1.03
			return 1
		}

		function getParkingCoefficient(p: string, isRent = false) {
			const map = {
				Нет: isRent ? 0.97 : 0.95,
				Открытая: 1,
				Крытая: isRent ? 1.02 : 1.03,
				Подземная: isRent ? 1.04 : 1.05,
			} as const
			return p in map ? map[p as keyof typeof map] : 1
		}

		function getYearBuiltCoefficient(y: number, isRent = false) {
			const age = new Date().getFullYear() - y
			if (age > 50) return isRent ? 0.9 : 0.85
			if (age > 30) return isRent ? 0.95 : 0.92
			return 1
		}

		function getKitchenAreaCoefficient(
			k: number,
			total: number,
			isRent = false
		) {
			if (k < 6) return isRent ? 0.96 : 0.95
			if (k / total > 0.15) return isRent ? 1.02 : 1.03
			return 1
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
						<RealtorList
							values={formData.agents}
							onChange={agents => setFormData(prev => ({ ...prev, agents }))}
						/>

						<OwnerList
							values={formData.owners}
							onChange={owners => setFormData(prev => ({ ...prev, owners }))}
						/>
						<PrimaryFactorsForm
							values={formData}
							onValueChange={(key, value) =>
								setFormData(prev => ({ ...prev, [key]: value }))
							}
							onSliderChange={(key, value) =>
								setFormData(prev => ({ ...prev, [key]: value[0].toString() }))
							}
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
									purpose={formData.purpose}
								/>
							</>
						)}

						<div className='mt-4 p-4 border-t'>
							<Button
								onClick={handleSubmit}
								disabled={isSubmitting}
								className='w-full'
							>
								{isSubmitting
									? 'Сохранение...'
									: isEditMode
									? 'Сохранить изменения'
									: 'Добавить объект'}
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
