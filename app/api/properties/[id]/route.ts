import { pool } from '@/lib/database'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params
		const propertyId = parseInt(id)
		const { status } = await req.json()

		const result = await pool.query(
			'UPDATE properties SET status = $1 WHERE id = $2 RETURNING *',
			[status, propertyId]
		)

		return NextResponse.json(result.rows[0])
	} catch (error) {
		console.error('Ошибка при обновлении статуса:', error)
		return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 })
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params
		const data = await req.json()

		const result = await pool.query(
			`UPDATE properties SET
				address = $1,
				district = $2,
				area = $3,
				price = $4,
				condition = $5,
				status = $6,
				metro_distance = $7,
				rooms = $8,
				renovation = $9,
				kitchen_area = $10,
				balcony_type = $11,
				building_type = $12,
				elevator_count = $13,
				has_freight_elevator = $14,
				ceiling_height = $15,
				parking_type = $16,
				floor = $17,
				total_floors = $18,
				year_built = $19,
				description = $20,
				purpose = $21,
				season = $22,
				inflation_rate = $23,
				documents = $24,
				price_per_m2 = $25,
				agents = $26,
				owners = $27
			WHERE id = $28
			RETURNING *`,
			[
				data.address,
				data.district,
				parseFloat(data.area),
				Math.round(parseFloat(data.price)),
				data.condition || 'не указано',
				data.status || 'не указано',
				parseInt(data.metroDistance),
				data.rooms,
				data.renovation,
				parseFloat(data.kitchenArea),
				data.balconyType,
				data.buildingType,
				parseInt(data.elevatorCount),
				data.hasFreightElevator,
				parseFloat(data.ceilingHeight),
				data.parkingType,
				parseInt(data.floor),
				parseInt(data.totalFloors),
				parseInt(data.yearBuilt),
				data.description,
				data.purpose,
				data.season,
				parseFloat(data.inflation_rate),
				data.documents,
				data.price_per_m2,
				JSON.stringify(data.agents ?? []),
				JSON.stringify(data.owners ?? []),
				Number(id),
			]
		)

		return NextResponse.json(result.rows[0])
	} catch (error) {
		console.error('Ошибка при обновлении объекта:', error)
		return NextResponse.json({ error: 'Ошибка обновления' }, { status: 500 })
	}
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = params
		const result = await pool.query('SELECT * FROM properties WHERE id = $1', [
			Number(id),
		])

		if (result.rows.length === 0) {
			return NextResponse.json({ error: 'Объект не найден' }, { status: 404 })
		}

		const row = result.rows[0]

		return NextResponse.json({
			...row,
			agents:
				typeof row.agents === 'string'
					? JSON.parse(row.agents || '[]')
					: row.agents ?? [],
			owners:
				typeof row.owners === 'string'
					? JSON.parse(row.owners || '[]')
					: row.owners ?? [],
		})
	} catch (error) {
		console.error('Ошибка при получении объекта:', error)
		return NextResponse.json(
			{ error: 'Ошибка получения объекта' },
			{ status: 500 }
		)
	}
}
