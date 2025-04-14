'use client'

import { useEffect, useState } from 'react'

export function PredictionForm() {
	const [district, setDistrict] = useState('')
	const [sort, setSort] = useState<'asc' | 'desc'>('asc')
	const [predictions, setPredictions] = useState<any[]>([])

	useEffect(() => {
		const query = new URLSearchParams()
		if (district) query.set('district', district)
		if (sort) query.set('sort', sort)

		fetch(`/api/predict?${query.toString()}`)
			.then(res => res.json())
			.then(data => setPredictions(data))
	}, [district, sort])

	return (
		<div className='space-y-4'>
			<div className='flex gap-4'>
				<select
					value={district}
					onChange={e => setDistrict(e.target.value)}
					className='border px-2 py-1'
				>
					<option value=''>Все районы</option>
					<option value='САО'>САО</option>
					<option value='ЮЗАО'>ЮЗАО</option>
					<option value='ЗАО'>ЗАО</option>
					<option value='ЦАО'>ЦАО</option>
					<option value='ВАО'>ВАО</option>
					<option value='ЮАО'>ЮАО</option>
				</select>

				<select
					value={sort}
					onChange={e => setSort(e.target.value as 'asc' | 'desc')}
					className='border px-2 py-1'
				>
					<option value='asc'>По возрастанию</option>
					<option value='desc'>По убыванию</option>
				</select>
			</div>

			<table className='w-full'>
				<tbody>
					{predictions.map((item, i) => {
						const diff =
							((item.predicted_price - item.current_price) /
								item.current_price) *
							100
						return (
							<tr key={i} className='border-t'>
								<td>{item.address}</td>
								<td className='text-right'>
									{Math.round(item.predicted_price).toLocaleString()} ₽
								</td>
								<td
									className={`text-right ${
										diff > 0 ? 'text-green-500' : 'text-red-500'
									}`}
								>
									{diff.toFixed(2)}%
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
