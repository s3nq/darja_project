'use client'

import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Info } from 'lucide-react'

export interface PriceDetailsType {
	basePrice: number
	totalArea: number
	pricePerSquareMeter: number
	districtCoefficient: number
	metroCoefficient: number
	primaryFactorsCoefficient: number
	secondaryFactorsCoefficient: number
}

export const PriceDetails = ({ details }: { details: PriceDetailsType }) => (
	<div className='border rounded-lg p-4 space-y-4'>
		<div className='flex items-center gap-2 text-muted-foreground'>
			<Info className='h-4 w-4' />
			<span className='text-sm'>
				Формула расчета: (База × Площадь) × Коэффициенты
			</span>
		</div>

		<Table>
			<TableBody>
				<TableRow>
					<TableCell className='font-medium'>Базовая цена</TableCell>
					<TableCell className='text-right'>
						{details.basePrice.toLocaleString()} ₽/м²
					</TableCell>
				</TableRow>

				<TableRow>
					<TableCell>Площадь</TableCell>
					<TableCell className='text-right'>{details.totalArea} м²</TableCell>
				</TableRow>

				<TableRow>
					<TableCell>Коэффициент района</TableCell>
					<TableCell className='text-right'>
						×{details.districtCoefficient.toFixed(2)}
					</TableCell>
				</TableRow>

				<TableRow>
					<TableCell>Коэффициент метро</TableCell>
					<TableCell className='text-right'>
						×{details.metroCoefficient.toFixed(2)}
					</TableCell>
				</TableRow>

				<TableRow>
					<TableCell className='font-medium'>Итог за м²</TableCell>
					<TableCell className='text-right font-medium'>
						{Math.round(details.pricePerSquareMeter).toLocaleString()} ₽
					</TableCell>
				</TableRow>

				<TableRow>
					<TableCell className='font-medium'>Общая стоимость</TableCell>
					<TableCell className='text-right font-medium text-primary'>
						<Badge variant='outline' className='px-3 py-1 text-base'>
							{(
								details.basePrice *
								details.totalArea *
								details.primaryFactorsCoefficient *
								details.secondaryFactorsCoefficient
							).toLocaleString()}{' '}
							₽
						</Badge>
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	</div>
)
