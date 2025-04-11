import fs from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const id = params.id
	const dirPath = path.join(process.cwd(), 'public', 'uploads', id)

	try {
		const files = await fs.readdir(dirPath)
		return NextResponse.json({ files })
	} catch {
		return NextResponse.json({ files: [] })
	}
}
