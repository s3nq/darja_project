export interface PropertyFormData {
	price(price: any): unknown
	condition: string
	total_floors: string
	district: string
	address: string
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
	description?: string
	purpose?: 'buy' | 'rent'
}
