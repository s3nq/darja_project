'use client'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export const CustomSlider = ({
	label,
	value,
	onValueChange,
	min,
	max,
	step,
}: {
	label: string
	value: number[]
	onValueChange: (value: number[]) => void
	min: number
	max: number
	step: number
}) => (
	<div className='space-y-4'>
		<div className='flex justify-between items-center'>
			<Label>{label}</Label>
			<span className='text-sm text-muted-foreground'>{value[0]}</span>
		</div>
		<Slider
			value={value}
			onValueChange={onValueChange}
			min={min}
			max={max}
			step={step}
		/>
		<div className='flex justify-between text-xs text-muted-foreground'>
			<span>{min}</span>
			<span>{max}</span>
		</div>
	</div>
)
