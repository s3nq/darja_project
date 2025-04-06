import { query } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const res = await query('SELECT current_user, NOW() as time')
		return NextResponse.json(res.rows[0])
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Database error' },
			{ status: 500 }
		)
	}
}
