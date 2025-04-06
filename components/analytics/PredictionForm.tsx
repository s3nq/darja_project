// components/analytics/PredictionForm.tsx
import { useState } from 'react'

export default function PredictionForm() {
	const [propertyType, setPropertyType] = useState('')
	const [location, setLocation] = useState('')
	const [inflationRate, setInflationRate] = useState(0)
	const [season, setSeason] = useState('')
	const [predictedPrice, setPredictedPrice] = useState<number | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const response = await fetch('/api/predict', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ propertyType, location, inflationRate, season }),
		})

		const data = await response.json()
		if (response.ok) {
			setPredictedPrice(data.predictedPrice)
		} else {
			console.error(data.error)
		}
	}

	return (
		<div>
			<h2>Прогноз цены</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Тип недвижимости:</label>
					<input
						type='text'
						value={propertyType}
						onChange={e => setPropertyType(e.target.value)}
						placeholder='Коммерческая/Жилая'
					/>
				</div>
				<div>
					<label>Местоположение:</label>
					<input
						type='text'
						value={location}
						onChange={e => setLocation(e.target.value)}
						placeholder='Город'
					/>
				</div>
				<div>
					<label>Коэффициент инфляции:</label>
					<input
						type='number'
						value={inflationRate}
						onChange={e => setInflationRate(parseFloat(e.target.value))}
						placeholder='Инфляция в %'
					/>
				</div>
				<div>
					<label>Сезон:</label>
					<select value={season} onChange={e => setSeason(e.target.value)}>
						<option value=''>Выберите сезон</option>
						<option value='summer'>Лето</option>
						<option value='winter'>Зима</option>
					</select>
				</div>
				<button type='submit'>Прогнозировать</button>
			</form>

			{predictedPrice !== null && (
				<div>
					<h3>Прогнозируемая цена: {predictedPrice} руб.</h3>
				</div>
			)}
		</div>
	)
}
