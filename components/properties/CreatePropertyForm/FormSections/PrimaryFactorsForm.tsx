'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { PropertyFormData } from '../types'

interface PrimaryFactorsProps {
	values: PropertyFormData
	onValueChange: (name: keyof PropertyFormData, value: string) => void
	onSliderChange: (name: keyof PropertyFormData, value: number[]) => void
}

export const PrimaryFactorsForm = ({
	values,
	onValueChange,
	onSliderChange,
}: PrimaryFactorsProps) => (
	<div className='space-y-6'>
		<div className='grid grid-cols-2 gap-4'>
			<div className='space-y-2'>
				<Label>Район</Label>
				<Select
					value={values.district}
					onValueChange={v => onValueChange('district', v)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Выберите район' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='Центральный район'>Центральный район</SelectItem>
						<SelectItem value='Северный район'>Северный район</SelectItem>
						<SelectItem value='Южный район'>Южный район</SelectItem>
						<SelectItem value='Восточный район'>Восточный район</SelectItem>
						<SelectItem value='Западный район'>Западный район</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='space-y-2'>
				<Label>Количество комнат</Label>
				<Select
					value={values.rooms}
					onValueChange={v => onValueChange('rooms', v)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Выберите количество' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='0'>Студия</SelectItem>
						<SelectItem value='1'>1 комната</SelectItem>
						<SelectItem value='2'>2 комнаты</SelectItem>
						<SelectItem value='3'>3 комнаты</SelectItem>
						<SelectItem value='4'>4 комнаты</SelectItem>
						<SelectItem value='5+'>5 и более</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>

		<div className='space-y-2'>
			<Label>Адрес</Label>
			<Input
				value={values.address}
				onChange={e => onValueChange('address', e.target.value)}
				placeholder='Полный адрес объекта'
			/>
		</div>

		<div className='space-y-2'>
			<Label>Расстояние до метро: {values.metroDistance} мин</Label>
			<Slider
				value={[Number(values.metroDistance)]}
				onValueChange={v => onSliderChange('metroDistance', v)}
				min={1}
				max={30}
				step={1}
			/>
		</div>

		<div className='grid grid-cols-2 gap-4'>
			<div className='space-y-2'>
				<Label>Ремонт</Label>
				<Select
					value={values.renovation}
					onValueChange={v => onValueChange('renovation', v)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Выберите состояние' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='Без отделки'>Без отделки</SelectItem>
						<SelectItem value='Требует ремонта'>Требует ремонта</SelectItem>
						<SelectItem value='Косметический ремонт'>
							Косметический ремонт
						</SelectItem>
						<SelectItem value='Евроремонт'>Евроремонт</SelectItem>
						<SelectItem value='Дизайнерский ремонт'>
							Дизайнерский ремонт
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='space-y-2'>
				<Label>Площадь кухни (м²)</Label>
				<Input
					type='number'
					value={values.kitchenArea}
					onChange={e => onValueChange('kitchenArea', e.target.value)}
				/>
			</div>
		</div>

		<div className='grid grid-cols-2 gap-4'>
			<div className='space-y-2'>
				<Label>Балкон / лоджия</Label>
				<Select
					value={values.balconyType}
					onValueChange={v => onValueChange('balconyType', v)}
				>
					<SelectTrigger>
						<SelectValue placeholder='Выберите тип' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='Нет'>Нет</SelectItem>
						<SelectItem value='Балкон'>Балкон</SelectItem>
						<SelectItem value='Лоджия'>Лоджия</SelectItem>
						<SelectItem value='Несколько'>Несколько</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className='space-y-2'>
				<Label>Высота потолков (м)</Label>
				<Input
					type='number'
					step='0.01'
					value={values.ceilingHeight}
					onChange={e => onValueChange('ceilingHeight', e.target.value)}
				/>
			</div>
		</div>

		<div className='space-y-2'>
			<Label>Парковка</Label>
			<Select
				value={values.parkingType}
				onValueChange={v => onValueChange('parkingType', v)}
			>
				<SelectTrigger>
					<SelectValue placeholder='Выберите наличие' />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='Нет'>Нет</SelectItem>
					<SelectItem value='Открытая'>Открытая</SelectItem>
					<SelectItem value='Крытая'>Крытая</SelectItem>
					<SelectItem value='Подземная'>Подземная</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</div>
)
