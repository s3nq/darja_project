// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				// Примерная валидация. Здесь должна быть проверка в БД.
				if (
					credentials?.email === 'admin@example.com' &&
					credentials?.password === 'admin'
				) {
					return { id: '1', name: 'Admin', email: 'admin@example.com' }
				}
				return null
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
	},
})
export { handler as GET, handler as POST }
