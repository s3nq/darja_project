'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './button'
import { Input } from './input'

interface RealtorListProps {
	values?: string[]
	onChange: (newList: string[]) => void
}

export function RealtorList({ values = [], onChange }: RealtorListProps) {
	const [input, setInput] = useState('')

	const addRealtor = () => {
		const trimmed = input.trim()
		if (trimmed) {
			onChange([...values, trimmed])
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
						className='flex items-center justify-between border p-2 rounded-md bg-gray-50 dark:bg-muted shadow-sm'
					>
						<span className='text-sm'>{name}</span>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => removeRealtor(i)}
							aria-label='Удалить риэлтора'
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
				<Button onClick={addRealtor} disabled={!input}>
					Добавить
				</Button>
			</div>
		</div>
	)
}
