export interface PropertyFormData {
	agents: never[]
	price: string
	condition: string
	totalFloors: string
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
	yearBuilt: string
	description?: string
	purpose?: 'buy' | 'rent'
	owners: {
		name: string
		phone: string
		email: string
	}[]
}
export interface Agent {
	name: string
}

export interface Owner {
	name: string
	phone?: string
	email?: string
}
