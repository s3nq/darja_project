// app/api/properties/route.ts

import { pool } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

const districtMap: Record<string, string> = {
	'Центральный район': 'ЦАО',
	'Северный район': 'САО',
	'Южный район': 'ЮАО',	
	'Западный район': 'ЗАО',
	'Восточный район': 'ВАО', 
}

export async function POST(req: NextRequest) {
	try {
		const data = await req.json()

		const {
			address,
			district,
			area,
			price,
			condition = 'не указано',
			status = 'не указано',
			metroDistance,
			rooms,
			renovation,
			kitchenArea,
			balconyType,
			buildingType,
			elevatorCount,
			hasFreightElevator,
			ceilingHeight,
			parkingType,
			floor,
			totalFloors,
			yearBuilt,
			description,
			purpose,
			season,
			inflation_rate,
			documents,
			owners,
			agents,
		} = data

		const shortDistrict = districtMap[district] || district
		const calculatedPricePerM2 = area && price ? Math.round(price / area) : null

		const result = await pool.query(
			`
      INSERT INTO properties (
        address, district, area, price, condition, status,
        metro_distance, rooms, renovation, kitchen_area,
        balcony_type, building_type, elevator_count, has_freight_elevator,
        ceiling_height, parking_type, floor, total_floors,
        year_built, description, purpose, season, inflation_rate, documents, price_per_m2,
        agents, owners
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24, $25,
        $26, $27
      )
      RETURNING *
    `,
			[
				address,
				shortDistrict,
				area,
				Math.round(price),
				condition,
				status,
				metroDistance,
				rooms,
				renovation,
				kitchenArea,
				balconyType,
				buildingType,
				elevatorCount,
				hasFreightElevator,
				ceilingHeight,
				parkingType,
				floor,
				totalFloors,
				yearBuilt,
				description,
				purpose,
				season,
				inflation_rate,
				documents,
				calculatedPricePerM2,
				JSON.stringify(agents ?? []),
				JSON.stringify(owners ?? []),
			]
		)

		return NextResponse.json(result.rows[0])
	} catch (error) {
		console.error('Ошибка при сохранении объекта:', error)
		return NextResponse.json(
			{ error: 'Ошибка при сохранении объекта' },
			{ status: 500 }
		)
	}
}

export async function GET() {
	try {
		const result = await pool.query(
			'SELECT * FROM properties ORDER BY created_at DESC'
		)
		return NextResponse.json(result.rows)
	} catch (error) {
		console.error('Ошибка при получении объектов:', error)
		return NextResponse.json(
			{ error: 'Ошибка при получении объектов' },
			{ status: 500 }
		)
	}
}
