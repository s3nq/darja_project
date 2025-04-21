'use client'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'

export function OwnerList({
	values,
	onChange,
}: {
	values: { name: string; phone: string; email: string }[]
	onChange: (newList: { name: string; phone: string; email: string }[]) => void
}) {
	const [owner, setOwner] = useState({ name: '', phone: '', email: '' })

	const addOwner = () => {
		if (owner.name.trim()) {
			onChange([...values, owner])
			setOwner({ name: '', phone: '', email: '' })
		}
	}

	const removeOwner = (index: number) => {
		onChange(values.filter((_, i) => i !== index))
	}

	return (
		<div className='space-y-4'>
			<h3 className='font-semibold text-lg'>Собственники</h3>
			<div className='space-y-2'>
				{values.map((o, i) => (
					<div
						key={i}
						className='border rounded p-3 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2'
					>
						<div>
							<p>
								<b>{o.name}</b>
							</p>
							<p className='text-sm text-muted-foreground'>{o.phone}</p>
							<p className='text-sm text-muted-foreground'>{o.email}</p>
						</div>
						<Button variant='ghost' size='icon' onClick={() => removeOwner(i)}>
							<Trash2 className='w-4 h-4 text-red-500' />
						</Button>
					</div>
				))}
			</div>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
				<Input
					placeholder='ФИО'
					value={owner.name}
					onChange={e => setOwner({ ...owner, name: e.target.value })}
				/>
				<Input
					placeholder='Телефон'
					value={owner.phone}
					onChange={e => setOwner({ ...owner, phone: e.target.value })}
				/>
				<Input
					placeholder='Email'
					value={owner.email}
					onChange={e => setOwner({ ...owner, email: e.target.value })}
				/>
			</div>
			<Button onClick={addOwner}>Добавить</Button>
		</div>
	)
}
