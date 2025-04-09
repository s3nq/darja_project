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

export async function PATCH(req: NextRequest) {
	try {
		const { id, status } = await req.json()

		const result = await pool.query(
			`UPDATE properties SET status = $1 WHERE id = $2 RETURNING *`,
			[status, id]
		)

		if (result.rowCount === 0) {
			return NextResponse.json({ error: 'Объект не найден' }, { status: 404 })
		}

		return NextResponse.json(result.rows[0])
	} catch (error) {
		console.error('Ошибка при обновлении статуса:', error)
		return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
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
			purpose,
		} = data

		const result = await pool.query(
			`
      INSERT INTO properties (
        address, district, area, price, condition, status,
        metro_distance, rooms, renovation, kitchen_area,
        balcony_type, building_type, elevator_count, has_freight_elevator,
        ceiling_height, parking_type, floor, total_floors,
        year_built, description, purpose
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18,
        $19, $20, $21
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
				purpose,
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
