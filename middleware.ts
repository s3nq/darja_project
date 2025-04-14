// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
	const isAuth = request.cookies.get('auth')?.value === 'true'

	const isLoginPage = request.nextUrl.pathname.startsWith('/login')

	if (!isAuth && !isLoginPage) {
		return NextResponse.redirect(new URL('/login', request.url))
	}

	if (isAuth && isLoginPage) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/', '/properties/:path*', '/analytics/:path*'],
}
