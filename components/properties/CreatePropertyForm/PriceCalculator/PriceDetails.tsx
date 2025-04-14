'use client'

import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Info } from 'lucide-react'
import { PriceDetailsType } from './types'

export function PriceDetails({ details }: { details: PriceDetailsType }) {
	const { purpose = 'buy' } = details
	const isRent = purpose === 'rent'

	return (
		<div className='border rounded-lg p-4 space-y-4'>
			<div className='flex items-center gap-2 text-muted-foreground'>
				<Info className='h-4 w-4' />
				<span className='text-sm'>
					Формула расчета: <br />
					(Базовая цена × Площадь) × Все_коэффициенты
				</span>
			</div>

			<Table>
				<TableBody>
					{/* БАЗОВОЕ */}

					<TableRow>
						<TableCell>Общая площадь</TableCell>
						<TableCell className='text-right'>{details.totalArea} м²</TableCell>
					</TableRow>

					{/* КОЭФФИЦИЕНТЫ */}
					<TableRow>
						<TableCell>Коэффициент района</TableCell>
						<TableCell className='text-right'>
							× {details.districtCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Коэффициент метро</TableCell>
						<TableCell className='text-right'>
							× {details.metroCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Коэффициент комнат</TableCell>
						<TableCell className='text-right'>
							× {details.roomsCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Коэффициент ремонта</TableCell>
						<TableCell className='text-right'>
							× {details.renovationCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Тип дома</TableCell>
						<TableCell className='text-right'>
							× {details.buildingCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Лифты</TableCell>
						<TableCell className='text-right'>
							× {details.elevatorCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Высота потолков</TableCell>
						<TableCell className='text-right'>
							× {details.ceilingCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Балкон / лоджия</TableCell>
						<TableCell className='text-right'>
							× {details.balconyCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Парковка</TableCell>
						<TableCell className='text-right'>
							× {details.parkingCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Год постройки</TableCell>
						<TableCell className='text-right'>
							× {details.yearBuiltCoef.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell>Площадь кухни</TableCell>
						<TableCell className='text-right'>
							× {details.kitchenCoef.toFixed(2)}
						</TableCell>
					</TableRow>

					{/* ИТОГИ */}
					<TableRow>
						<TableCell className='font-medium'>Итог за м²</TableCell>
						<TableCell className='text-right font-medium'>
							{Math.round(details.pricePerSquareMeter).toLocaleString()} ₽
						</TableCell>
					</TableRow>

					{isRent ? (
						<>
							<TableRow>
								<TableCell className='font-medium'>Аренда в месяц</TableCell>
								<TableCell className='text-right font-medium text-primary'>
									<Badge variant='outline' className='px-3 py-1 text-base'>
										{details.rentMonth?.toLocaleString()} ₽
									</Badge>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Аренда в сутки</TableCell>
								<TableCell className='text-right'>
									{details.rentDay?.toLocaleString()} ₽
								</TableCell>
							</TableRow>
						</>
					) : (
						<TableRow>
							<TableCell className='font-medium'>Общая стоимость</TableCell>
							<TableCell className='text-right font-medium text-primary'>
								<Badge variant='outline' className='px-3 py-1 text-base'>
									{Math.round(details.finalPrice).toLocaleString()} ₽
								</Badge>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
}
