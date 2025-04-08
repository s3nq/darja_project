import { pool } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
	try {
		const result = await pool.query(
			'SELECT * FROM properties ORDER BY created_at DESC'
		)
		return NextResponse.json(result.rows)
	} catch (error) {
		console.error('Ошибка при получении данных:', error)
		return NextResponse.json(
			{ error: 'Ошибка при получении данных' },
			{ status: 500 }
		)
	}
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
		} = data

		const result = await pool.query(
			`
      INSERT INTO properties (
        address, district, area, price, condition, status,
        metro_distance, rooms, renovation, kitchen_area,
        balcony_type, building_type, elevator_count, has_freight_elevator,
        ceiling_height, parking_type, floor, total_floors,
        year_built, description
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18,
        $19, $20
      )
      RETURNING *
    `,
			[
				address,
				district,
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
			]
		)

		// Возвращаем весь объект
		return NextResponse.json(result.rows[0])
	} catch (error) {
		console.error('Ошибка при сохранении объекта:', error)
		return NextResponse.json(
			{ error: 'Ошибка при сохранении объекта' },
			{ status: 500 }
		)
	}
}
