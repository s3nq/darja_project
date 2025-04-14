// types/property.ts
export type PropertyFormData = {
	district: string
	address: string
	price_per_m2?: number
	metroDistance: string
	rooms: string
	renovation: string
	kitchenArea: string
	balconyType: string
	buildingType: string
	elevatorCount: string
	hasFreightElevator: boolean
	ceilingHeight: string
	parkingType: string
	area: string
	floor: string
	totalFloors: string
	yearBuilt: string
	description: string
	purpose: 'buy' | 'rent'
}

export type PriceDetails = {
	basePrice: number
	price_per_m2?: number
	totalArea: number
	pricePerSquareMeter: number
	districtCoefficient: number
	metroCoefficient: number
	roomsCoefficient: number
	renovationCoefficient: number
	kitchenCoefficient: number
	balconyCoefficient: number
	primaryFactorsCoefficient: number
	buildingTypeCoefficient: number
	elevatorCoefficient: number
	ceilingHeightCoefficient: number
	parkingCoefficient: number
	secondaryFactorsCoefficient: number
	purpose: 'buy' | 'rent'
}

export interface Property {
	calculatedPricePerM2: any
	price_per_m2?: number
	condition: string
	building_type: string
	year_built: string
	elevator_count: string
	ceiling_height: string
	parking_type: string
	total_floors: string
	balcony_type: string
	status: string
	id: string
	createdAt: Date
	district: string
	address: string
	metroDistance: number
	rooms: number
	renovation: string
	kitchenArea: number
	balconyType: string
	buildingType: string
	elevatorCount: number
	hasFreightElevator: boolean
	ceilingHeight: number
	parkingType: string
	area: number
	floor: number
	totalFloors: number
	yearBuilt: number
	description?: string
	price: number
	purpose: 'buy' | 'rent'
}
