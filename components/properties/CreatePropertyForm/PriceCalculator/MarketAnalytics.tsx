'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
interface MarketAnalyticsProps {
	district: string
	pricePerM2: number
}

export const MarketAnalytics = ({
	district,
	pricePerM2,
}: MarketAnalyticsProps) => (
	<div className='border rounded-lg p-4'>
		<Tabs defaultValue='comparison'>
			<TabsList className='grid w-full grid-cols-2'>
				<TabsTrigger value='comparison'>Сравнение</TabsTrigger>
				<TabsTrigger value='dynamics'>Динамика</TabsTrigger>
			</TabsList>

			<TabsContent value='comparison'>
				<div className='space-y-4 pt-4'>
					<div className='flex justify-between items-center'>
						<span className='text-sm'>Средняя цена в {district}:</span>
						<span className='font-medium'>
							{Math.round(pricePerM2 * 0.95).toLocaleString()} -{' '}
							{Math.round(pricePerM2 * 1.15).toLocaleString()} ₽/м²
						</span>
					</div>

					<div className='h-32 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground'>
						График сравнения
					</div>
				</div>
			</TabsContent>

			<TabsContent value='dynamics'>
				<div className='pt-4'>
					<div className='h-32 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground'>
						График динамики цен
					</div>
					<p className='text-sm text-muted-foreground pt-2'>
						Изменение цены за последние 12 месяцев: +5.3%
					</p>
				</div>
			</TabsContent>
		</Tabs>
	</div>
)
