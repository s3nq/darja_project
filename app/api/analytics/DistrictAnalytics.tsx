// components/analytics/DistrictAnalytics.tsx
'use client'

import { useEffect, useState } from 'react'

export function DistrictAnalytics() {
	const [data, setData] = useState<{ district: string; count: number }[]>([])

	useEffect(() => {
		fetch('/api/analytics/districts')
			.then(res => res.json())
			.then(setData)
	}, [])

	return (
		<ul className='space-y-2'>
			{data.map(d => (
				<li key={d.district} className='flex justify-between'>
					<span>{d.district}</span>
					<span className='font-medium'>{d.count} объектов</span>
				</li>
			))}
		</ul>
	)
}
