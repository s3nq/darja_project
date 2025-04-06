export interface Property {
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
}
