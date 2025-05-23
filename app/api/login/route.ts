// app/api/login/route.ts
import { mockUser } from '@/lib/mockUser'
import { serialize } from 'cookie'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	const { email, password } = await req.json()

	if (email === mockUser.email && password === mockUser.password) {
		const res = NextResponse.json({ message: 'ok' })
		res.headers.set(
			'Set-Cookie',
			serialize('auth', 'true', { path: '/', maxAge: 60 * 60 * 24 }) 
		)
		return res
	}

	return NextResponse.json({ error: 'Неверные данные' }, { status: 401 })
}
