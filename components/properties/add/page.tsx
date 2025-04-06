'use client'

import { GeneralParamsForm } from '@/components/properties/CreatePropertyForm/FormSections/GeneralParamsForm'
import { CalculatorCard } from '@/components/properties/CreatePropertyForm/PriceCalculator/CalculatorCard'
import { useState } from 'react'
import { PrimaryFactorsForm } from '../CreatePropertyForm/FormSections/PrimaryFactorsForm'
import { SecondaryFactorsForm } from '../CreatePropertyForm/FormSections/SecondaryFactorsForm'
import { MarketAnalytics } from '../CreatePropertyForm/PriceCalculator/MarketAnalytics'
import { PriceDetails } from '../CreatePropertyForm/PriceCalculator/PriceDetails'
import { PriceDetailsType } from '../CreatePropertyForm/PriceCalculator/PriceDetails'
export default function AddPropertyPage() {
	const [formData, setFormData] = useState({
		district: '',
		rooms: '1',
		metroDistance: '10',
		buildingType: 'Панельный',
		hasFreightElevator: false,
		area: '',
		floor: '',
		totalFloors: '',
		yearBuilt: new Date().getFullYear().toString(),
		description: '',
	})

	// Указываем правильный тип для состояния
	const [priceDetails, setPriceDetails] = useState<PriceDetailsType | null>(
		null
	)
	const [calculationSuccess, setCalculationSuccess] = useState(false)

	const handleValueChange = (name: string, value: string) => {
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	// Добавляем обработчики для switch и slider
	const handleSwitchChange = (name: string, checked: boolean) => {
		setFormData(prev => ({ ...prev, [name]: checked }))
	}

	const handleSliderChange = (name: string, value: number[]) => {
		setFormData(prev => ({ ...prev, [name]: value[0].toString() }))
	}

	const calculatePrice = async () => {
		setPriceDetails({
			basePrice: 250000,
			totalArea: Number(formData.area) || 50,
			pricePerSquareMeter: 275000,
			districtCoefficient: 1.15,
			metroCoefficient: 0.98,
			primaryFactorsCoefficient: 1.1,
			secondaryFactorsCoefficient: 1.05,
		})
		setCalculationSuccess(true)
	}

	return (
		<div className='container mx-auto py-8'>
			<div className='grid md:grid-cols-2 gap-8'>
				<div className='space-y-8'>
					<PrimaryFactorsForm
						values={formData}
						onValueChange={handleValueChange}
						onSliderChange={handleSliderChange} // Исправленный обработчик
					/>
					<SecondaryFactorsForm
						values={formData}
						onValueChange={handleValueChange}
						onSwitchChange={handleSwitchChange} // Исправленный обработчик
					/>
					<GeneralParamsForm
						values={formData}
						onValueChange={handleValueChange}
					/>
				</div>

				<div className='space-y-8'>
					<CalculatorCard
						price={
							priceDetails
								? priceDetails.basePrice * priceDetails.totalArea
								: null
						}
						onCalculate={calculatePrice}
						calculationSuccess={calculationSuccess}
						isCalculating={false}
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
				</div>
			</div>
		</div>
	)
}
