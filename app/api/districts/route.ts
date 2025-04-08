// app/api/districts/route.ts
import { pool } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const result = await pool.query(`
      SELECT DISTINCT district FROM properties ORDER BY district
    `)
		return NextResponse.json(result.rows.map(r => r.district))
	} catch (err) {
		console.error('[districts] error:', err)
		return NextResponse.json(
			{ error: 'Failed to fetch districts' },
			{ status: 500 }
		)
	}
}
