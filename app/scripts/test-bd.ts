import { db } from '../../lib/database'

async function testConnection() {
	try {
		const properties = await db.getProperties()
		console.log('Успешное подключение к базе данных!')
		console.log('Найдено объектов:', properties.length)
	} catch (error) {
		console.error('Ошибка подключения:', error)
	}
}

testConnection()
