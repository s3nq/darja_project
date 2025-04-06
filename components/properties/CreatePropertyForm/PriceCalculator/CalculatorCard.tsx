'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calculator, Check } from 'lucide-react'

interface CalculatorCardProps {
	calculatedPrice: number | null
	calculationSuccess: boolean
	onCalculate: () => void
}

export const CalculatorCard = ({
	calculatedPrice,
	calculationSuccess,
	onCalculate,
}: CalculatorCardProps) => (
	<div className='border rounded-lg p-6 space-y-4'>
		<div className='text-center'>
			{calculatedPrice ? (
				<>
					<p className='text-muted-foreground text-sm'>Расчетная стоимость</p>
					<h2 className='text-3xl font-bold'>
						{calculatedPrice.toLocaleString()} ₽
					</h2>
				</>
			) : (
				<p className='text-muted-foreground'>Заполните данные для расчета</p>
			)}
		</div>

		<Button onClick={onCalculate} className='w-full'>
			<Calculator className='mr-2 h-4 w-4' />
			Рассчитать цену
		</Button>

		{calculationSuccess && (
			<Badge className='w-full justify-center bg-green-100 text-green-800'>
				<Check className='mr-2 h-4 w-4' />
				Расчет выполнен
			</Badge>
		)}
	</div>
)
