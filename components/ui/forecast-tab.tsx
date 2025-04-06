// components/ui/forecast-tab.tsx

import { useEffect, useState } from 'react'

const ForecastTab = () => {
	const [forecastData, setForecastData] = useState<any[]>([])

	// Функция для получения прогноза с API
	const fetchForecast = async () => {
		try {
			const response = await fetch('/api/forecast')
			const data = await response.json()
			setForecastData(data)
		} catch (error) {
			console.error('Error fetching forecast data:', error)
		}
	}

	// Загружаем прогноз при монтировании компонента
	useEffect(() => {
		fetchForecast()
	}, [])

	return (
		<div className='forecast-tab'>
			<h2>Прогноз стоимости недвижимости</h2>
			<table className='forecast-table'>
				<thead>
					<tr>
						<th>ID</th>
						<th>Сезон</th>
						<th>Цена</th>
						<th>Прогнозируемая цена (с учетом инфляции и сезона)</th>
					</tr>
				</thead>
				<tbody>
					{forecastData.length > 0 ? (
						forecastData.map(item => (
							<tr key={item.id}>
								<td>{item.id}</td>
								<td>{item.season}</td>
								<td>{item.price}</td>
								<td>{item.predicted_price}</td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan={4}>Загрузка...</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export default ForecastTab
