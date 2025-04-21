'use client'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'

export function RealtorList({
	values,
	onChange,
}: {
	values: string[]
	onChange: (newList: string[]) => void
}) {
	const [input, setInput] = useState('')

	const addRealtor = () => {
		if (input.trim()) {
			onChange([...values, input.trim()])
			setInput('')
		}
	}

	const removeRealtor = (index: number) => {
		onChange(values.filter((_, i) => i !== index))
	}

	return (
		<div className='space-y-4'>
			<h3 className='font-semibold text-lg'>Риэлторы</h3>
			<div className='space-y-2'>
				{values.map((name, i) => (
					<div
						key={i}
						className='flex items-center justify-between border p-2 rounded shadow-sm'
					>
						<span>{name}</span>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => removeRealtor(i)}
						>
							<Trash2 className='w-4 h-4 text-red-500' />
						</Button>
					</div>
				))}
			</div>
			<div className='flex gap-2'>
				<Input
					value={input}
					onChange={e => setInput(e.target.value)}
					placeholder='ФИО риэлтора'
					className='flex-1'
				/>
				<Button onClick={addRealtor}>Добавить</Button>
			</div>
		</div>
	)
}
