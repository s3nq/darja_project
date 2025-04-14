// app/api/logout/route.ts
import { serialize } from 'cookie'
import { NextResponse } from 'next/server'

export async function GET() {
	const res = NextResponse.json({ message: 'Logged out' })
	res.headers.set('Set-Cookie', serialize('auth', '', { path: '/', maxAge: 0 }))
	return res
}
