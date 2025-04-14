// app/login/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const handleLogin = async () => {
		const res = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
			headers: { 'Content-Type': 'application/json' },
		})

		if (res.ok) {
			router.push('/')
		} else {
			setError('Неверные данные')
		}
	}

	return (
		<div className='flex min-h-screen items-center justify-center bg-gray-100'>
			<div className='bg-white p-6 rounded shadow-md w-96 space-y-4'>
				<h1 className='text-xl font-bold'>Вход</h1>
				{error && <p className='text-red-500'>{error}</p>}
				<input
					type='email'
					placeholder='Email'
					value={email}
					onChange={e => setEmail(e.target.value)}
					className='w-full border p-2 rounded'
				/>
				<input
					type='password'
					placeholder='Пароль'
					value={password}
					onChange={e => setPassword(e.target.value)}
					className='w-full border p-2 rounded'
				/>
				<button
					onClick={handleLogin}
					className='w-full bg-black text-white p-2 rounded'
				>
					Войти
				</button>
			</div>
		</div>
	)
}
