'use client'

import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { PropertyFormData } from '../types'

interface SecondaryFactorsProps {
	values: PropertyFormData
	onValueChange: (name: keyof PropertyFormData, value: string) => void
	onSwitchChange: (name: keyof PropertyFormData, checked: boolean) => void
}

export const SecondaryFactorsForm = ({
	values,
	onValueChange,
	onSwitchChange,
}: SecondaryFactorsProps) => (
	<div className='space-y-6'>
		<div className='space-y-2'>
			<Label>Тип дома</Label>
			<Select
				value={values.buildingType || ''}
				onValueChange={v => onValueChange('buildingType', v)}
			>
				<SelectTrigger>
					<SelectValue placeholder='Выберите тип' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='Кирпичный'>Кирпичный</SelectItem>
					<SelectItem value='Монолитный'>Монолитный</SelectItem>
					<SelectItem value='Монолитно-кирпичный'>
						Монолитно-кирпичный
					</SelectItem>
					<SelectItem value='Панельный'>Панельный</SelectItem>
					<SelectItem value='Блочный'>Блочный</SelectItem>
					<SelectItem value='Деревянный'>Деревянный</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<div className='grid grid-cols-2 gap-4'>
			<div className='space-y-2'>
				<Label>Количество лифтов</Label>
				<Select
					value={values.elevatorCount ?? ''}
					onValueChange={v => onValueChange('elevatorCount', v)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Выберите количество' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='0'>Нет</SelectItem>
						<SelectItem value='1'>1 лифт</SelectItem>
						<SelectItem value='2'>2 лифта</SelectItem>
						<SelectItem value='3'>3 лифта</SelectItem>
						<SelectItem value='4'>4 и более</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='flex items-center space-x-2 pt-8'>
				<Switch
					checked={!!values.hasFreightElevator}
					onCheckedChange={checked =>
						onSwitchChange('hasFreightElevator', checked)
					}
				/>
				<Label>Грузовой лифт</Label>
			</div>
		</div>
	</div>
)
