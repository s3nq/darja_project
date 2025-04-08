import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from './QueryProvider'

export const metadata: Metadata = {
	title: 'darja_project',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	)
}
