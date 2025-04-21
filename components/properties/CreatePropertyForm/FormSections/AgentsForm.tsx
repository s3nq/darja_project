'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Owner } from '../types'

interface OwnersFormProps {
	owners: Owner[]
	onChange: (owners: Owner[]) => void
}

export function OwnersForm({ owners, onChange }: OwnersFormProps) {
	const handleChange = (index: number, field: keyof Owner, value: string) => {
		const updated = [...owners]
		updated[index][field] = value
		onChange(updated)
	}

	const handleAdd = () => {
		onChange([...owners, { name: '', phone: '', email: '' }])
	}

	const handleRemove = (index: number) => {
		const updated = owners.filter((_, i) => i !== index)
		onChange(updated)
	}

	return (
		<div className='space-y-2'>
			<h3 className='text-base font-semibold'>👤 Собственники</h3>
			{owners.map((owner, index) => (
				<div key={index} className='grid grid-cols-3 gap-2 items-center'>
					<Input
						value={owner.name}
						onChange={e => handleChange(index, 'name', e.target.value)}
						placeholder='ФИО'
					/>
					<Input
						value={owner.phone}
						onChange={e => handleChange(index, 'phone', e.target.value)}
						placeholder='Телефон'
					/>
					<Input
						value={owner.email}
						onChange={e => handleChange(index, 'email', e.target.value)}
						placeholder='Почта'
					/>
					<Button
						type='button'
						variant='ghost'
						onClick={() => handleRemove(index)}
					>
						✕
					</Button>
				</div>
			))}
			<Button type='button' variant='outline' onClick={handleAdd}>
				Добавить собственника
			</Button>
		</div>
	)
}
