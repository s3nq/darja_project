import { pool } from '@/lib/database'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const { agents } = await req.json()

		const statsQuery = `
  SELECT 
    agent_name as agent,
    COUNT(*) FILTER (WHERE status = 'sold')::int as sales
  FROM properties, jsonb_array_elements_text(agents) as agent_name
  WHERE agent_name = ANY($1::text[])
  GROUP BY agent_name
`

		const { rows } = await pool.query(statsQuery, [agents])

		const stats = rows.reduce(
			(acc: Record<string, number>, { agent, sales }) => {
				acc[agent] = sales
				return acc
			},
			{}
		)

		return NextResponse.json(stats)
	} catch (error) {
		console.error('Error fetching agent stats:', error)
		return new NextResponse('Internal Error', { status: 500 })
	}
}
