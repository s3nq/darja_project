'use client'

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
import { ArrowLeft } from 'lucide-react'

export default function AddPropertyPage() {
	const router = useRouter()

	// Все поля формы
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

	// Детальные расчёты
	const [priceDetails, setPriceDetails] = useState<PriceDetailsType | null>(
		null
	)
	// Флажок «Успешно посчитали»
	const [calculationSuccess, setCalculationSuccess] = useState(false)
	// Флаг отправки формы
	const [isSubmitting, setIsSubmitting] = useState(false)

	// ─────────────────────────────────────────────────────────────────────────────
	// Методы для обновления стейта
	// ─────────────────────────────────────────────────────────────────────────────
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

	// ─────────────────────────────────────────────────────────────────────────────
	// «Умные» коэффициенты. В реальном проекте лучше вынести их в отдельный файл.
	// ─────────────────────────────────────────────────────────────────────────────

	function getDistrictCoefficient(district: string): number {
		switch (district) {
			case 'Центральный район':
				return 1.15
			case 'Северный район':
				return 1.05
			case 'Южный район':
				return 0.98
			case 'Восточный район':
				return 0.95
			case 'Западный район':
				return 1.0
			default:
				return 1.0
		}
	}

	function getMetroCoefficient(distanceMin: number): number {
		// Меньше минуты ставим 1.0, если 30 мин — 0.7 (например)
		const dist = Math.max(1, Math.min(distanceMin, 40)) // ограничим 1..40
		// Допустим, каждые 5 минут минус 5% от цены
		// distance = 1 => 1.0
		// distance = 5 => 0.95
		// distance = 10 => 0.90
		return 1.0 - Math.floor(dist / 5) * 0.0029
	}

	function getRoomsCoefficient(rooms: string): number {
		if (rooms === '0') {
			// студия
			return 0.9
		}
		const num = parseInt(rooms)
		// Пример: если 5+, ставим 0.75
		// (реальная логика — на твой вкус)
		if (rooms === '5+') return 0.75
		// Уменьшение цены с ростом комнат, например
		return 1.0 - num * 0.02 // кажд. комната -2%
	}

	function getRenovationCoefficient(renovation: string): number {
		switch (renovation) {
			case 'Без отделки':
				return 0.8
			case 'Требует ремонта':
				return 0.9
			case 'Косметический ремонт':
				return 1.0
			case 'Евроремонт':
				return 1.1
			case 'Дизайнерский ремонт':
				return 1.2
			default:
				return 1.0
		}
	}

	function getBuildingTypeCoefficient(type: string): number {
		switch (type) {
			case 'Кирпичный':
				return 1.05
			case 'Монолитный':
				return 1.08
			case 'Монолитно-кирпичный':
				return 1.1
			case 'Панельный':
				return 0.95
			case 'Блочный':
				return 0.9
			case 'Деревянный':
				return 0.8
			default:
				return 1.0
		}
	}

	function getElevatorCoefficient(
		elevatorCount: number,
		freight: boolean
	): number {
		// если вообще нет лифтов = минус 5%
		if (elevatorCount === 0) return 0.95
		// за каждый дополнительный лифт +2%
		const base = 1.0 + (elevatorCount - 1) * 0.02
		// грузовой лифт ещё +3%
		return freight ? base + 0.03 : base
	}

	function getCeilingHeightCoefficient(ceiling: number): number {
		// средняя высота 2.5-2.8
		// если выше 3 => +5%, если ниже 2.5 => -5%
		if (ceiling >= 3.0) return 1.05
		if (ceiling < 2.5) return 0.95
		return 1.0
	}

	function getBalconyCoefficient(balconyType: string): number {
		switch (balconyType) {
			case 'Нет':
				return 0.97
			case 'Балкон':
			case 'Лоджия':
				return 1.0
			case 'Несколько':
				return 1.03
			default:
				return 1.0
		}
	}

	function getParkingCoefficient(type: string): number {
		switch (type) {
			case 'Нет':
				return 0.95
			case 'Открытая':
				return 1.0
			case 'Крытая':
				return 1.03
			case 'Подземная':
				return 1.05
			default:
				return 1.0
		}
	}

	function getYearBuiltCoefficient(year: number): number {
		// Пример: если дом старше 50 лет => дешевле
		const currentYear = new Date().getFullYear()
		const buildingAge = currentYear - year
		if (buildingAge > 50) return 0.85
		if (buildingAge > 30) return 0.92
		return 1.0
	}

	function getKitchenAreaCoefficient(kArea: number, totalArea: number): number {
		// Пример: если кухня < 6 => -5%, если 15%+ от общей площади => +3%
		if (!totalArea || !kArea) return 1.0
		if (kArea < 6) return 0.95
		const ratio = kArea / totalArea
		if (ratio > 0.15) return 1.03
		return 1.0
	}

	// ─────────────────────────────────────────────────────────────────────────────
	//  расчёт
	// ─────────────────────────────────────────────────────────────────────────────
	async function calculatePrice() {
		// Сначала простая проверка
		if (!formData.area || !formData.district) {
			toast.error('Заполните хотя бы Общую площадь и Район!')
			return
		}

		try {
			const basePrice = 231000 // базовая цена за м², меняй как хочешь
			const totalArea = parseFloat(formData.area) || 50

			// Собираем все коэф.
			const districtCoef = getDistrictCoefficient(formData.district)
			const metroCoef = getMetroCoefficient(parseInt(formData.metroDistance))
			const roomsCoef = getRoomsCoefficient(formData.rooms)
			const renovationCoef = getRenovationCoefficient(formData.renovation)
			const buildingCoef = getBuildingTypeCoefficient(formData.buildingType)
			const elevatorCoef = getElevatorCoefficient(
				parseInt(formData.elevatorCount),
				formData.hasFreightElevator
			)
			const ceilingCoef = getCeilingHeightCoefficient(
				parseFloat(formData.ceilingHeight)
			)
			const balconyCoef = getBalconyCoefficient(formData.balconyType)
			const parkingCoef = getParkingCoefficient(formData.parkingType)
			const yearBuiltCoef = getYearBuiltCoefficient(
				parseInt(formData.yearBuilt)
			)
			const kitchenCoef = getKitchenAreaCoefficient(
				parseFloat(formData.kitchenArea),
				totalArea
			)

			// итоговый множитель (перемножаем все)
			const finalCoefficient =
				districtCoef *
				metroCoef *
				roomsCoef *
				renovationCoef *
				buildingCoef *
				elevatorCoef *
				ceilingCoef *
				balconyCoef *
				parkingCoef *
				yearBuiltCoef *
				kitchenCoef

			// Цена за 1 м²
			const finalPricePerM2 = basePrice * finalCoefficient
			// Общая цена = (цена за м²) * площадь
			const finalPrice = finalPricePerM2 * totalArea

			// Формируем объект детализации
			const details: PriceDetailsType = {
				basePrice,
				totalArea,

				// для удобства
				districtCoef,
				metroCoef,
				roomsCoef,
				renovationCoef,
				buildingCoef,
				elevatorCoef,
				ceilingCoef,
				balconyCoef,
				parkingCoef,
				yearBuiltCoef,
				kitchenCoef,

				// Итоговая цена за м²
				pricePerSquareMeter: finalPricePerM2,
				// Итоговая стоимость
				finalPrice,
			}

			setPriceDetails(details)
			setCalculationSuccess(true)
			setTimeout(() => setCalculationSuccess(false), 2500)
		} catch (error) {
			console.error('Calculation error:', error)
			toast.error('Ошибка при расчёте цены')
		}
	}

	// ─────────────────────────────────────────────────────────────────────────────
	// Отправка данных на бэкенд
	// ─────────────────────────────────────────────────────────────────────────────
	async function handleSubmit() {
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
					floor: parseInt(formData.floor),
					totalFloors: parseInt(formData.totalFloors),
					yearBuilt: parseInt(formData.yearBuilt),
					metroDistance: parseInt(formData.metroDistance),
					elevatorCount: parseInt(formData.elevatorCount),
					kitchenArea: parseFloat(formData.kitchenArea),
					price: priceDetails.finalPrice,
				}),
			})

			if (!response.ok) throw new Error('Ошибка сохранения объекта')

			toast.success('Объект успешно добавлен!')

			// Сброс формы и результатов после сохранения
			setFormData({
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

			setPriceDetails(null)
			setCalculationSuccess(false)
		} catch (error) {
			console.error('Submission error:', error)
			toast.error('Ошибка при сохранении объекта')
		} finally {
			setIsSubmitting(false)
		}
	}

	// ─────────────────────────────────────────────────────────────────────────────
	// Рендер
	// ─────────────────────────────────────────────────────────────────────────────
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
				{/* Левая часть (формы) */}
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

				{/* Правая часть (калькулятор, итоги, аналитика) */}
				<div className='space-y-6'>
					<CalculatorCard
						// показываем именно итоговую стоимость
						calculatedPrice={priceDetails?.finalPrice ?? null}
						calculationSuccess={calculationSuccess}
						onCalculate={calculatePrice}
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
