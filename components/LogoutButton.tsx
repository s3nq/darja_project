// components/LogoutButton.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
	const router = useRouter()

	const handleLogout = async () => {
		await fetch('/api/logout')
		router.push('/login')
	}

	return (
		<Button onClick={handleLogout} variant='outline' size='sm'>
			Выйти
		</Button>
	)
}
