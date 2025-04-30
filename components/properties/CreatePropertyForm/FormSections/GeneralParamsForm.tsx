'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PropertyFormData } from '../types'

interface GeneralParamsProps {
	values: PropertyFormData
	onValueChange: (name: keyof PropertyFormData, value: string) => void
}

export const GeneralParamsForm = ({
	values,
	onValueChange,
}: GeneralParamsProps) => (
	<div className='space-y-6'>
		<div className='grid grid-cols-3 gap-4'>
			<div className='space-y-2'>
				<Label>Общая площадь (м²)</Label>
				<Input
					type='number'
					value={values.area ?? ''}
					onChange={e => onValueChange('area', e.target.value)}
				/>
			</div>
			<div className='space-y-2'>
				<Label>Этаж</Label>
				<Input
					type='number'
					value={values.floor ?? ''}
					onChange={e => onValueChange('floor', e.target.value)}
					placeholder='Этаж'
					min='0'
				/>
			</div>
			<div className='space-y-2'>
				<Label>Всего этажей</Label>
				<Input
					type='number'
					value={values.totalFloors ?? ''}
					onChange={e => onValueChange('totalFloors', e.target.value)}
				/>
			</div>
		</div>

		<div className='space-y-2'>
			<Label>Год постройки</Label>
			<Input
				type='number'
				value={values.yearBuilt ?? ''}
				onChange={e => onValueChange('yearBuilt', e.target.value)}
			/>
		</div>

		<div className='space-y-2'>
			<Label>Описание объекта</Label>
			<Textarea
				value={values.description ?? ''}
				onChange={e => onValueChange('description', e.target.value)}
			/>
		</div>
	</div>
)
