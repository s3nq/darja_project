'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Property } from '@/types/property'
import { ArrowDownToLine, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const REQUIRED_DOCS = [
	'Паспорт объекта',
	'Планировка',
	'Оценка стоимости',
	'Договор аренды',
]

interface PropertyModalProps {
	property: Property | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function PropertyModal({
	property,
	open,
	onOpenChange,
}: PropertyModalProps) {
	const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
	const dropRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!property) return

		const fetchUploaded = async () => {
			const res = await fetch(`/api/properties/${property.id}/uploaded`)
			if (res.ok) {
				const files: string[] = await res.json()
				setUploadedDocs(files)
			}
		}

		fetchUploaded()
	}, [property])

	if (!property) return null

	const handleUpload = async (file: File, docType: string) => {
		if (!file || !property.id) return

		const formData = new FormData()
		formData.append('file', file)
		formData.append('type', docType)

		const res = await fetch(`/api/properties/${property.id}/upload`, {
			method: 'POST',
			body: formData,
		})

		if (res.ok) {
			setUploadedDocs(prev => [...prev, `${docType}.pdf`])
		}
	}

	const handleDownload = async (docType: string) => {
		if (!property?.id) return
		window.open(
			`/api/properties/${property.id}/download?type=${encodeURIComponent(
				docType
			)}`,
			'_blank'
		)
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		if (!property?.id) return
		const file = e.dataTransfer.files[0]
		if (file && file.type === 'application/pdf') {
			const docType = prompt(
				'Укажите тип документа (например: Паспорт объекта)'
			)
			if (docType) {
				handleUpload(file, docType)
			}
		}
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
	}

	const handleFileSelect = (docType: string) => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = 'application/pdf'
		input.onchange = e => {
			const target = e.target as HTMLInputElement
			const file = target.files?.[0]
			if (file) {
				handleUpload(file, docType)
			}
		}
		input.click()
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-3xl max-h-[90vh] overflow-hidden'>
				<DialogHeader>
					<DialogTitle className='text-xl font-bold'>
						{property.address}
					</DialogTitle>
					<DialogDescription className='text-sm text-muted-foreground'>
						{property.district}
					</DialogDescription>
				</DialogHeader>

				<ScrollArea className='h-[70vh] pr-2'>
					<div className='space-y-6 text-xl'>
						{/* Основная информация */}
						<div>
							<h3 className='text-base font-semibold mb-2'>🏠 Основное</h3>
							<div className='grid grid-cols-2 gap-2 text-sm'>
								<p>
									<b>Цена:</b> {Number(property.price).toLocaleString()} ₽
								</p>
								<p>
									<b>Площадь:</b> {property.area} м²
								</p>
								<p>
									<b>Район:</b> {property.district}
								</p>
								<p>
									<b>Состояние:</b> {property.condition || 'не указано'}
								</p>
								<p>
									<b>Цель:</b>{' '}
									{property.purpose === 'rent' ? 'Аренда' : 'Покупка'}
								</p>
								{property.description && (
									<p className='col-span-2'>
										<b>Описание:</b> {property.description}
									</p>
								)}
							</div>
						</div>

						{/* Характеристики */}
						<div>
							<h3 className='text-base font-semibold mb-2'>
								🔧 Характеристики
							</h3>
							<div className='grid grid-cols-2 gap-2 text-sm'>
								<p>
									<b>Тип дома:</b> {property.building_type || 'не указано'}
								</p>
								<p>
									<b>Год постройки:</b> {property.year_built || 'не указан'}
								</p>
								<p>
									<b>Ремонт:</b> {property.condition || 'не указан'}
								</p>
								<p>
									<b>Лифтов:</b> {property.elevator_count ?? 'не указано'}{' '}
									{property.hasFreightElevator
										? '(грузовой есть)'
										: '(без грузового)'}
								</p>
								<p>
									<b>Высота потолков:</b>{' '}
									{property.ceiling_height || 'не указана'} м
								</p>
								<p>
									<b>Парковка:</b> {property.parking_type || 'не указано'}
								</p>
							</div>
						</div>

						{/* Планировка */}
						<div>
							<h3 className='text-base font-semibold mb-2'>📐 Планировка</h3>
							<div className='grid grid-cols-2 gap-2 text-sm'>
								<p>
									<b>Этаж:</b> {property.floor} / {property.total_floors || '—'}
								</p>
								<p>
									<b>Балкон:</b> {property.balcony_type || 'не указано'}
								</p>
							</div>
						</div>

						{/* Документы */}
						<div>
							<h3 className='text-base font-semibold mb-2'>📎 Документы</h3>
							<div
								ref={dropRef}
								onDrop={handleDrop}
								onDragOver={handleDragOver}
								className='border border-dashed border-gray-300 p-4 rounded-md mb-4 text-sm text-muted-foreground text-center'
							>
								Перетащите PDF-документ сюда для загрузки
							</div>

							<ul className='text-sm space-y-2'>
								{REQUIRED_DOCS.map(doc => {
									const isUploaded = uploadedDocs.includes(`${doc}.pdf`)
									return (
										<li key={doc} className='flex items-center justify-between'>
											<span
												className={cn(
													isUploaded ? 'text-green-600' : 'text-gray-500'
												)}
											>
												{doc} {isUploaded && '(загружен)'}
											</span>
											<div className='flex gap-2'>
												<Button
													variant='secondary'
													size='sm'
													onClick={() => handleFileSelect(doc)}
												>
													<Upload className='w-4 h-4 mr-2' />
													Загрузить
												</Button>
												<Button
													variant='outline'
													size='sm'
													disabled={!isUploaded}
													onClick={() => handleDownload(doc)}
												>
													<ArrowDownToLine className='w-4 h-4 mr-2' />
													Скачать
												</Button>
											</div>
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}
