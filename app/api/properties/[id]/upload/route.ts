import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export const config = {
	api: {
		bodyParser: false,
	},
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const formData = await req.formData()
	const file = formData.get('file') as File
	const type = formData.get('type') as string
	const propertyId = params.id

	if (!file || !type) {
		return NextResponse.json({ error: 'Некорректные данные' }, { status: 400 })
	}

	const dir = path.join(process.cwd(), 'public', 'uploads', propertyId)
	if (!existsSync(dir)) await mkdir(dir, { recursive: true })

	const arrayBuffer = await file.arrayBuffer()
	const buffer = Buffer.from(arrayBuffer)
	const filePath = path.join(dir, `${type}.pdf`)
	await writeFile(filePath, buffer)

	return NextResponse.json({ success: true })
}
