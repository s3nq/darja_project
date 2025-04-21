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
import { Property } from '@/types/property'
import { ArrowDownToLine, Download, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

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
	const router = useRouter()

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

	const handleUpload = async (file: File, docType: string) => {
		if (!file || !property?.id) return
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

	const handleFileSelect = () => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = 'application/pdf'
		input.onchange = e => {
			const file = (e.target as HTMLInputElement)?.files?.[0]
			if (file) {
				const name = file.name.replace(/\.pdf$/, '')
				handleUpload(file, name)
			}
		}
		input.click()
	}

	const handleDownloadAll = () => {
		if (!property?.id) return
		window.open(`/api/properties/${property.id}/download-all`, '_blank')
	}

	const handleDownload = (docName: string) => {
		if (!property?.id) return
		window.open(
			`/api/properties/${property.id}/download?type=${encodeURIComponent(
				docName
			)}`,
			'_blank'
		)
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		const file = e.dataTransfer.files?.[0]
		if (file?.type === 'application/pdf') {
			const docType = prompt('Введите название документа')
			if (docType) handleUpload(file, docType)
		}
	}

	const handleDelete = async (filename: string) => {
		if (!property?.id) return
		const res = await fetch(
			`/api/properties/${property.id}/delete?file=${encodeURIComponent(
				filename
			)}`,
			{ method: 'DELETE' }
		)
		if (res.ok) {
			setUploadedDocs(prev => prev.filter(name => name !== filename))
		}
	}

	if (!property) return null

	const staticDocs: Record<string, string> = {
		'Акт приема-передачи': 'akt.pdf',
		'Выписка из домовой книги': 'domkniga.pdf',
		'Выписка из ЕГРН': 'egrn.pdf',
		'Договор купли-продажи': 'kyplya.pdf',
		'Выписка из финансово-лицевого счёта': 'licevoy.pdf',
		'Справка из ПНД': 'pnd.pdf',
		'Договор о передачи собственности': 'sobstv.pdf',
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
					<div className='space-y-6 text-sm'>
						{/* информация */}
						<h3 className='text-base font-semibold mb-2'>🏠 Информация</h3>
						<div className='grid grid-cols-2 gap-2'>
							<p>
								<b>Цена:</b> {Number(property.price).toLocaleString()} ₽
							</p>
							{property.price_per_m2 && (
								<p>
									<b>Цена за м²:</b> {property.price_per_m2.toLocaleString()} ₽
								</p>
							)}
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

						{/* Характеристики */}
						<div>
							<h3 className='text-base font-semibold mb-2'>
								🔧 Характеристики
							</h3>
							<div className='grid grid-cols-2 gap-2'>
								<p>
									<b>Тип дома:</b> {property.building_type || 'не указано'}
								</p>
								<p>
									<b>Год постройки:</b> {property.year_built || 'не указан'}
								</p>
								<p>
									<b>Ремонт:</b> {property.condition || 'не указано'}
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
						{/* Собственники */}
						{Array.isArray(property.owners) && property.owners.length > 0 && (
							<div className='space-y-2'>
								<h3 className='text-base font-semibold mb-2'>
									🧑‍💼 Собственники
								</h3>
								<div className='grid gap-3'>
									{property.owners.map((owner, idx) => (
										<div
											key={idx}
											className='border rounded-md p-3 bg-gray-50 dark:bg-muted text-sm'
										>
											<p className='font-semibold text-black dark:text-white'>
												{owner.name}
											</p>
											<p className='text-muted-foreground text-sm'>
												📞 <span className='ml-1'>{owner.phone}</span>
											</p>
											<p className='text-muted-foreground text-sm'>
												📧 <span className='ml-1'>{owner.email}</span>
											</p>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Риэлторы */}
						{Array.isArray(property.agents) && property.agents.length > 0 && (
							<div className='space-y-2'>
								<h3 className='text-base font-semibold mb-2'>👩‍💼 Риэлторы</h3>
								<ul className='grid gap-2 list-none'>
									{property.agents.map((agent, idx) => (
										<li
											key={idx}
											className='border rounded-md px-3 py-2 bg-gray-50 dark:bg-muted text-sm'
										>
											{agent}
										</li>
									))}
								</ul>
							</div>
						)}

						<Button
							variant='outline'
							onClick={() => router.push(`/properties/${property.id}/edit`)}
						>
							Редактировать
						</Button>

						{/* документы */}
						<div>
							<div className='flex justify-between items-center mb-2'>
								<div>
									<h3 className='text-base font-semibold'>📎 Документы</h3>
									<p className='text-xs text-muted-foreground mt-1'>
										В архив войдут: {Object.keys(staticDocs).join(', ')} +
										загруженные PDF-файлы.
									</p>
								</div>
								<Button variant='default' size='sm' onClick={handleDownloadAll}>
									<ArrowDownToLine className='w-4 h-4 mr-2' />
									Скачать всё
								</Button>
							</div>

							{/* отдельные скачивания шаблонов */}
							<div className='grid grid-cols-2 gap-2 mb-4'>
								{Object.entries(staticDocs).map(([name, filename]) => (
									<Button
										key={filename}
										variant='outline'
										size='sm'
										className='justify-between'
										onClick={() => handleDownload(name)}
									>
										{name}
										<Download className='w-4 h-4 ml-2' />
									</Button>
								))}
							</div>

							{/* drag and drop */}
							<div
								ref={dropRef}
								onDrop={handleDrop}
								onDragOver={e => e.preventDefault()}
								onClick={handleFileSelect}
								className='cursor-pointer border border-dashed border-gray-300 p-4 rounded-md mb-4 text-center text-muted-foreground hover:bg-gray-50 transition'
							>
								Нажмите или перетащите PDF-документ сюда
							</div>

							{/* загруженные документы */}
							<div className='space-y-2'>
								{uploadedDocs.map(file => (
									<div key={file} className='flex items-center justify-between'>
										<span>{file}</span>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => handleDelete(file)}
										>
											<Trash2 className='w-4 h-4 text-red-500' />
										</Button>
									</div>
								))}
							</div>
						</div>
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}
