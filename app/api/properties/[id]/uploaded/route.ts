import { existsSync, readdirSync } from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { join } from 'path'

export async function GET(
	req: NextRequest,
	context: { params: { id: string } }
) {
	const { id } = await context.params

	const dir = join(process.cwd(), 'public', 'uploads', id)

	if (!existsSync(dir)) {
		return NextResponse.json([], { status: 200 })
	}

	const files = readdirSync(dir).filter(f => f.endsWith('.pdf'))
	return NextResponse.json(files)
}
