import { existsSync, readdirSync } from 'fs'
import { NextResponse } from 'next/server'
import { join } from 'path'

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	const { id } = params
	const dir = join(process.cwd(), 'public', 'uploads', id)

	if (!existsSync(dir)) {
		return NextResponse.json([], { status: 200 })
	}

	const files = readdirSync(dir).filter(f => f.endsWith('.pdf'))
	return NextResponse.json(files)
}
