type Property = {
	id: number
	address: string
	price: number
	status: string
}

export function PropertyList({ properties }: { properties: Property[] }) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
			{properties.map(prop => (
				<div key={prop.id} className='border rounded p-4 shadow-sm'>
					<div className='text-lg font-semibold'>{prop.address}</div>
					<div className='text-sm text-gray-600'>
						{prop.price.toLocaleString()} ₽
					</div>
					<div
						className={`mt-2 inline-block px-2 py-1 rounded text-xs ${
							prop.status === 'В продаже'
								? 'bg-green-100 text-green-800'
								: 'bg-gray-200 text-gray-700'
						}`}
					>
						{prop.status === 'В продаже' ? 'В работе' : 'Не в работе'}
					</div>
				</div>
			))}
		</div>
	)
}
